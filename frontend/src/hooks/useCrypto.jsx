import React, { useCallback, useState, useEffect } from "react"
import { useActiveUserStore } from "./useActiveUser"
import useMessaging, { useMessageStore } from "./useMessaging"
import 'regenerator-runtime/runtime'
import { set, get, del } from 'idb-keyval';

export default function useCrypto() {

    let [publicKeys, setPublicKeys] = useState({ encryption: null, signing: null })
    let user = useActiveUserStore(s => s.active)
    let [room, changeRoom] = useMessageStore(s => [s.currentRoom, s.changeRoom])
    let [roomkey, setRoomkey] = useState()
    let [signKeys, setSignKeys] = useState()
    let [rsaPub, setRsaPub] = useState()

    useEffect(() => {
        console.count("key check")
        async function check() {
            if (!user) return
            let keypair = await get(`user:${user.name}:rsa`)
            let signkeypair = await get(`user:${user.name}:ecdsa`)
            if (!keypair) {
                keypair = await createRSApair()
                signkeypair = await createECDSApair()
                set(`user:${user.name}:rsa`, keypair)
                set(`user:${user.name}:ecdsa`, signkeypair)
            }
            setSignKeys(signkeypair)
            let encrKey = window.crypto.subtle.exportKey("jwk", keypair.publicKey)
            let signKey = window.crypto.subtle.exportKey("jwk", signkeypair.publicKey)
            setPublicKeys({ encryption: await encrKey, signing: await signKey })
            let rk = await createAESKey()
            setRoomkey(rk)
            setRsaPub(keypair.publicKey)
            let w = await wrapRoomkey(await encrKey, rk)
            let uw = await unwrapKey(keypair.privateKey, w)
            console.dir(uw)
        }
        check()
    }, [user])

    useEffect(() => {
        if (!room) return
        get(`room:${room.name}`)
            .then(key => setRoomkey(key))
            .catch(err => console.error(`Roomkey for ${room.name} not found`))
    }, [room])


    useEffect(() => {
        if (roomkey && rsaPub) {
            async function dene() {
                let msg = { msg: "XCXZCXZC" }
                let enc = await encrypt(msg)
                let dec = await decrypt(enc)
                let sig = await sign(dec)
                console.dir({ enc, dec, sig })
                console.dir(rsaPub)
                // let raw = await window.crypto.subtle.exportKey("raw", rsaPub)
                let x = await wrapKey(rsaPub, roomkey)
                console.log("wrapped")
                console.dir(x)
            }
            // dene()
        }
    }, [roomkey, rsaPub])

    async function encrypt(msg) {
        let buf = str2ab(JSON.stringify(msg))
        let iv = window.crypto.getRandomValues(new Uint16Array(8));
        let cipher = await window.crypto.subtle.encrypt({ name: "AES-CBC", iv }, roomkey, buf)
        return { ciphertext: ab2str(cipher), iv: ab2str(iv) }
    }

    async function decrypt({ iv, ciphertext }) {
        let plain = await window.crypto.subtle.decrypt({ name: "AES-CBC", iv: str2ab(iv) }, roomkey, str2ab(ciphertext))
        return JSON.parse(ab2str(plain))
    }

    async function sign(data) {
        let buf = str2ab(JSON.stringify(data))
        let sig = await window.crypto.subtle.sign(
            {
                name: "ECDSA",
                hash: { name: "SHA-256" },
            },
            signKeys.privateKey,
            buf)
        return ab2str(sig)
    }

    async function createRoomKey(roomname) {
        let key = await createAESKey()
        set(`room:${roomname}`, key)
    }

    async function wrapRoomkey(jwkRsaPubKey, roomname) {
        // let rk = await get(`room:${roomname}`)
        console.dir(jwkRsaPubKey)
        let k = await window.crypto.subtle.importKey("jwk", jwkRsaPubKey, { name: "RSA-OAEP", hash: { name: "SHA-256" } }, true, ["wrapKey"])
        let wrapped = await wrapKey(k, roomname)
        return ab2str(wrapped)
    }

    return { encrypt, decrypt, publicKeys, sign }
}

async function wrapKey(rsaPubKey, aesKey) {
    return window.crypto.subtle.wrapKey(
        "jwk",
        aesKey,
        rsaPubKey,
        {
            name: "RSA-OAEP",
            hash: { name: "SHA-256" }
        }
    )
}
async function unwrapKey(rsaPrivKey, wrappedAesJwk) {
    return window.crypto.subtle.unwrapKey(
        "jwk",
        str2ab(wrappedAesJwk),
        rsaPrivKey,
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: { name: "SHA-256" }
        },
        {
            name: "AES-CBC",
            length: 128
        },
        true,
        ["encrypt", "decrypt"]
    )
}

async function createRSApair() {
    return window.crypto.subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),  // 24 bit representation of 65537
        hash: { name: "SHA-256" }
    }, false, ["wrapKey", "unwrapKey"])
}

export async function createAESKey() {

    let keys = await window.crypto.subtle.generateKey(
        { name: "AES-CBC", length: 128 },
        true,
        ["encrypt", "decrypt"])
    let raw = await window.crypto.subtle.exportKey("raw", keys)
    return keys
}

export function createECDSApair() {
    return window.crypto.subtle.generateKey(
        {
            name: "ECDSA",
            namedCurve: "P-256", //can be "P-256", "P-384", or "P-521"
        },
        false, //whether the key is extractable (i.e. can be used in exportKey)
        ["sign", "verify"] //can be any combination of "sign" and "verify"
    )
}

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}