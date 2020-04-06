import React, { useState, useCallback } from "react"
import { Form, FormField, Button } from 'grommet'
import { useActiveUserStore } from "../hooks/useActiveUser"

export default function Login() {
    let [errors, setErrors] = useState({})
    let [waiting, setWaiting] = useState(false)
    let loggedin = useActiveUserStore(s => s.loggedin)

    let login = useCallback(async (form) => {
        setWaiting(true)
        console.dir(form)
        let resp = await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: form.username, security_code: form.password })
        })
        if (!resp.ok) {
            setErrors({ username: "This is wrong", password: "Maybe this is wrong" })
            setWaiting(false)
        }
        else {
            loggedin({ name: form.username, status: "online" })
        }
    }, [])

    return (
        <Form onSubmit={({ value }) => login(value)} errors={errors}>
            <FormField name="username" label="Username" />
            <FormField name="password" label="Password" />
            <Button disabled={waiting} fill type="submit" primary label="Login" />
        </Form>
    )
}