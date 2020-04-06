import React, { useState, useCallback } from "react"
import { Form, FormField, Button, Main, Heading } from 'grommet'
import QRCode from 'qrcode.react'
import { createRSApair, createECDSApair, createKeysForRegister } from '../hooks/useCrypto'
import { set } from "idb-keyval"


export default function Register() {
    let [errors, setErrors] = useState({ exist: false })
    let [waiting, setWaiting] = useState(false)
    let [qr, setQr] = useState()
    let [form, setForm] = useState()

    let register = useCallback(async (username) => {
        setWaiting(true)
        let { pub, orig } = await createKeysForRegister()

        fetch("http://localhost:8000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: username,
                rsa_public_key: pub.rsa,
                ecdsa_public_key: pub.ecdsa
            })
        }).then(resp => {
            if (!resp.ok)
                throw new Error(resp.json())
            else return resp
        })
            .then(resp => resp.json())
            .then(({ totp }) => {
                set(`user:${username}:rsa`, orig.rsa)
                set(`user:${username}:ecdsa`, orig.ecdsa)
                setQr(totp)
                setErrors({ exist: false })
                setWaiting(false)
            }).catch(err => {
                setErrors({ username: "retry", exist: true })
                setWaiting(false)
            })
    }, [])

    return (
        (qr && !waiting) ? <QrView value={qr} /> : (
            <Form errors={errors}>
                <FormField value={form} name="username" label="Username" onChange={e => setForm(e.target.value)} />
                <Button onClick={() => register(form)} disabled={false} fill type="submit" primary label="Register" />
            </Form>)
    )
}


function QrView({ value }) {
    return (
        <Main alignSelf="center" pad="large" alignContent="center">
            <QRCode style={{ alignSelf: "center" }} value={value} />
            <Heading level="4" alignSelf="center" textAlign="center">
                Scan this QR code in your favorite Authenticator app.
                Use generated key as password.
            </Heading>
            <Heading textAlign="center">~</Heading>
        </Main>
    )
}