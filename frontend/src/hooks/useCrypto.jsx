import React, { useCallback, useState, useEffect } from "react"
import { useActiveUserStore } from "./useActiveUser"
import useMessaging, { useMessageStore } from "./useMessaging"
import 'regenerator-runtime/runtime'
import { set, get, del } from 'idb-keyval';

export default function useCrypto() {

    let [publicKey, setPublicKey] = useState()

    let user = useActiveUserStore(s => s.active)

    let [room] = useMessageStore(s => [s.currentRoom])

    let [roomkey, setRoomkey] = useState()

    let [keys, setKeys] = useState()
    let [signKeys, setSignKeys] = useState()

    useEffect(() => {
        console.count("key check")
        async function check() {
            if (!user) return
            console.count("boiiiii")
            let keypair = await get(`user:${user.name}:rsa`)
            let signkeypair = await get(`user:${user.name}:ecdsa`)
            if (!keypair) {
                keypair = await createRSApair()
                signkeypair = await createECDSApair()
                set(`user:${user.name}:rsa`, keypair)
                set(`user:${user.name}:ecdsa`, signkeypair)
            } else {
                console.log(keypair.publicKey)
                console.log(signkeypair.privateKey)
            }
            setKeys(keypair)
            setSignKeys(signkeypair)
            createAESKey().then(k => {
                console.log("AESKEYS: ")
                console.dir(k)
                setRoomkey(k)
            })
        }
        check()
    }, [user])

    useEffect(() => {
        if (!room) return
        get(`room:${room.name}`)
            .then(key => setRoomkey(key))
            .catch(err => console.error(`Roomkey for ${room.name} not found`))
    }, [room])

    const encrypt = useCallback((msg) => {
        return new Promise((res, rej) => {
            msg = Buffer.from(JSON.stringify(msg))
            let iv = window.crypto.getRandomValues(new Uint8Array(16));
            window.crypto.subtle.encrypt({ name: "AES-CBC", iv }, roomkey, msg)
                .then(ciphertext => res({ iv, ciphertext: ab2str(ciphertext) }))
                .catch(err => rej(err))
        })
    }, [roomkey])

    const decrypt = useCallback(({ iv, ciphertext }) => {
        return new Promise((res, rej) => {
            window.crypto.subtle.decrypt({ name: "AES-CBC", iv: iv }, roomkey, ciphertext)
                .then(plaintext => res(plaintext))
                .catch(err => rej(err))
        })
    }, [roomkey])

    const sign = useCallback(data => {
        return new Promise((res, rej) => {
            let buf = Buffer.from(JSON.stringify(data))
            window.crypto.subtle.sign(
                {
                    name: "ECDSA",
                    hash: { name: "SHA-256" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
                },
                signKeys.privateKey, //from generateKey or importKey above
                buf
            ).then(sig => res(ab2str(sig)))
                .catch(err => rej(err))
        })
    }, [signKeys])

    useEffect(() => {
        encrypt({ msg: "aasdasdasdajklhsdfghjkvdfhjkdfg" }).then(v => console.log(v))
    }, [sign])

    return { encrypt, decrypt, publicKey, sign }
}

async function createRSApair() {
    return window.crypto.subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),  // 24 bit representation of 65537
        hash: { name: "SHA-256" }
    }, false, ["encrypt", "decrypt"])
}

export async function createAESKey() {
    return window.crypto.subtle.generateKey(
        { name: "AES-CBC", length: 128 },
        true,
        ["encrypt", "decrypt"])
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