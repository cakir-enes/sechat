import React, { useState, useCallback } from "react"
import {Form, FormField, Button} from 'grommet'

export default function Login() {
    let [errors, setErrors] = useState({})
    let [waiting, setWaiting] = useState(false)

    let login = useCallback((form) => {
        setWaiting(true)
        fetch("http://localhost:8000/login", {
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
            <FormField name="password" label="Password" />
            <Button disabled={waiting} fill type="submit" primary label="Login" />
        </Form>
    )
}