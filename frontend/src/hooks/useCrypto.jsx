import React, { useCallback, useState, useEffect } from "react"
import { useActiveUserStore } from "./useActiveUser"


export default function useCrypto() {
    let [keystore, setKeystore] = useState()
    let [publicKey, setPublicKey] = useState()
    let [user] = useActiveUserStore(s => s.active)

    useEffect(() => {
        KeyStore().then(ks => {
            setKeystore(ks)
        }).catch(err => console.error(`Coudlnt open keystore ${err}`)) // getKey, saveAesKey, saveRsaKey listKeys
    }, [])

    const encrypt = useCallback(() => {

    }, [])

    const decrypt = useCallback(() => {

    }, [])

    return { encrypt, decrypt, publicKey }
}


async function createAndSaveRSAKeyPair(ks) {

    let { publicKey, privateKey } = await window.crypto.subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),  // 24 bit representation of 65537
        hash: { name: "SHA-256" }
    }, false, ["encrypt", "decrypt"])

    ks.saveRsaKey(publicKey, privateKey, "rsapair")
}