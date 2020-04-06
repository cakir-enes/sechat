from fastapi import FastAPI, HTTPException, WebSocket
import pyotp
from tinydb import TinyDB, Query
from pydantic import BaseModel
from ecdsa import VerifyingKey
import json
from typing import List, Dict
from fastapi.middleware.cors import CORSMiddleware
import time
import asyncio
import json


from timeloop import Timeloop
from datetime import timedelta

import uuid

import uvicorn

user_db = TinyDB("user.json")
room_db = TinyDB("room.json")
pending_db = TinyDB("pending.json")


jobs = []
rooms = {}
sessions = {}
loop = asyncio.get_event_loop()


class User(BaseModel):
    name: str
    rsa_public_key: Dict
    ecdsa_public_key: Dict
    totp_secret: str = None


class UserLogin(BaseModel):
    name: str
    security_code: str


class Room(BaseModel):
    name: str
    admin_name: str
    participants: List[str] = []


class Pending(BaseModel):
    room_name: str
    user_name: str
    admin_name: str
    id: str = str(uuid.uuid1())


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "http://localhost:1234"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/register", status_code=200)
def register(user: User):
    q = Query()
    exists = user_db.search(q.name == user.name)
    if exists:
        raise HTTPException(status_code=409, detail="User already exists")
    secret = pyotp.random_base32()
    totp = pyotp.TOTP(secret).provisioning_uri(name=user.name, issuer_name="FETOCHAT")
    user.totp_secret = secret
    user_db.insert(user.dict())
    return {"totp": totp}


@app.post("/login", status_code=200)
async def login(body: UserLogin):
    user = check_user(body.name)
    totp = pyotp.TOTP(user.totp_secret)
    auth = totp.verify(str(body.security_code))
    if not auth:
        raise HTTPException(status_code=401, detail="Wrong security code")
    await broadcast("USER_LOGGED_IN", {"name": user.name, "status": "online"})


def get_joined_rooms(username: str):
    rooms = room_db.search(username in Query()["participants"])
    return json.dumps(rooms)


class RoomCreate(BaseModel):
    room_name: str
    admin_name: str
    signature: str


@app.post("/create-room", status_code=200)
async def make_room(req: RoomCreate):
    # valid = verify_signature(
    #     req.admin_name, req.room_name + req.admin_name, req.signature
    # )
    user = check_user(req.admin_name)
    room = Query()
    alreadyCreated = room_db.search(room.name == req.room_name)
    if alreadyCreated:
        raise HTTPException(status_code=401, detail="Room already exists")
    room = Room(
        admin_name=req.admin_name, participants=[req.admin_name], name=req.room_name
    )
    room_db.insert(room.dict())
    print("BROADCASTING")
    await broadcast(
        "NEW_ROOM",
        {"name": room.name, "users": [{"name": user.name, "status": "online"}]},
    )


class JoinReq(BaseModel):
    room_name: str
    user_name: str
    signature: str


@app.post("/join-room", status_code=200)
async def join_room(req: JoinReq):
    # verify_signature(req.user_name, req.room_name, req.signature)
    room = check_room(req.room_name)
    pending = Pending(
        room_name=req.room_name, user_name=req.user_name, admin_name=room.admin_name
    )
    pending_db.insert(pending.dict())
    try:
        await send_to(
            room.admin_name,
            "NEW_REQ",
            {"issuer": req.user_name, "room_name": room.name, "req_id": pending.id},
        )
    except Exception as e:
        print(f"Dude is not online {room.admin_name} err: {e}")


class InvReq(BaseModel):
    req_id: str
    accepting: bool
    signature: str


@app.post("/handle-join-req", status_code=200)
def handle_join_req(req: InvReq):
    inv = check_inv(req.req_id)
    # verify_signature(inv.admin_name, req.req_id + req.accepting, req.signature)
    if req.accepting:
        issuer = check_user(inv.user_name)
        return {"rsa_public_key": issuer.rsa_public_key}
    Inv = Query()
    pending_db.remove(Inv.id == req.req_id)


class ForwardReq(BaseModel):
    req_id: str
    key: str
    signature: str


@app.post("/forward-key", status_code=200)
async def forward_key(req: ForwardReq):
    inv = check_inv(req.req_id)
    try:
        inv = check_inv(req.req_id)
        ws = sessions[inv.user_name]
        ws.send_json(
            {
                "event": "REQ_ACCEPTED",
                "payload": {"ROOM": inv.room_name, "KEY": req.key},
            }
        )
    except:
        print("error")


@app.websocket("/notifications/{username}")
async def message_updates(ws: WebSocket, username: str):
    await ws.accept()
    challenge = pyotp.random_base32()
    await ws.send_json({"type": "CHALLENGE", "payload": challenge})
    # TODO CHECK THIS SHIT
    # resp = await ws.receive_text()
    # print(f"RESP: {resp}")
    sessions[username] = ws
    print(sessions.keys())
    # valid = verify_signature(username, challenge, resp)
    valid = True

    if not valid:
        ws.send_text("thats not cool bro")
        ws.close()
        return

    while True:
        data = await ws.receive_text()


@app.post("/broadcast")
async def broadcast(_type, payload):
    print(len(sessions.values()))
    for k, ws in sessions.items():
        try:
            await ws.send_json({"type": _type, "payload": payload})
        except:
            print("hes offline")
            del sessions[k]


async def send_to(username, _type, payload):
    await sessions[username].send_json({"type": _type, "payload": payload})


def check_user(user_name: str) -> User:
    q = Query()
    user = user_db.search(q.name == user_name)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User.parse_obj(user[0])


def check_room(room_name: str) -> Room:
    q = Query()
    room = room_db.search(q.name == room_name)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return Room.parse_obj(room[0])


def check_inv(req_id: str) -> Pending:
    q = Query()
    inv = pending_db.search(q.id == req_id)
    if not inv:
        raise HTTPException(status_code=404, detail="Invitation not found")
    return Pending.parse_obj(inv[0])


def verify_signature(user_name: str, to_verify: str, claim: str) -> bool:
    user = check_user(user_name)
    ecdsa_public_key = VerifyingKey.from_string(user.ecdsa_public_key)
    validation = ecdsa_public_key.verify(to_verify, claim)
    if not validation:
        raise HTTPException(status_code=401, detail="Unverified signature")
    return validation


# @tl.job(interval=timedelta(seconds=2))
# def forward_pending():
#     for req in pending_db.all(): # todo handle offline users
#         ws = sessions[req.user_name]
#         ws.send_json([req.])


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
