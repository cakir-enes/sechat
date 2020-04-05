import React, { useState, useCallback } from "react"
import {Form, FormField, Button} from 'grommet'

export default function Register() {
    let [errors, setErrors] = useState({})
    let [waiting, setWaiting] = useState(false)
    let [qr, setQr] = useState()

    let register = useCallback((form) => {
        setWaiting(true)
        fetch("http://localhost:8000/register", {
            method: "POST",
            headers: {
                 "Content-Type": "application/json",
            },
            body: JSON.stringify(form)
        })
    }, [])

    return (
        <Form onSubmit={({value}) => console.dir(value)}  errors={errors}>
            <FormField name="username" label="Username" />
            <Button disabled={waiting} fill type="submit" primary label="Register" />
        </Form>
    )
}