from fastapi import FastAPI
import pyotp


if __name__ == "__main__":
    totp = pyotp.TOTP("JXCVXCVXCVXC").provisioning_uri(
        name="alice", issuer_name="Bzimapp"
    )
    print(totp)


# app = FastAPI()

# @app.get("/")
# def read_root():
#     return {"Hello": "World"}
