import React, { useState, useCallback } from "react"
import useMessaging from "../hooks/useMessaging"
import { Main, Grid, Box, Text, Paragraph, Heading, TextInput, Button, Form, Keyboard } from "grommet"
import { Send } from "grommet-icons"

export default function Chat() {

    let { send, messages, room } = useMessaging()
    let [value, setValue] = useState("")

    let sendMsg = () => { console.log("Sendong: " + value); setValue("") }

    return (
        room ? (<Keyboard onEnter={sendMsg} >
            <div style={{ display: "grid", gridTemplateRows: "auto 3rem", height: "92vh" }}>

                <div style={{ width: "100%" }}>
                    {messages.length > 0 ? messages.reduce(({ boxes, prevSender, isLeft }, current) => {
                        if (current.sender !== prevSender)
                            isLeft = !isLeft
                        return { boxes: [...boxes, <Message content={current.content} sender={current.sender} time={current.time} isLeft={isLeft} />] }
                    }, { boxes: [], prevSender: messages[0].sender, isLeft: true }).boxes
                        : <Heading textAlign="center">No Messages Yet</Heading>}
                </div>

                <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                    <TextInput placeholder="Type here" value={value} onChange={e => setValue(e.target.value)} />
                    <Button primary type="submit" margin={{ left: "4px" }} icon={<Send />} onClick={sendMsg} />
                </div>
            </div>
        </Keyboard>) : <Heading>Start a chat first</Heading>

    )
}

function Message({ content, isLeft, sender, time }) {

    let C = <Paragraph>{content}</Paragraph>
    let S = <Text size="small" margin="0.5rem">{`${sender}@${time}`}</Text>

    return (
        <Box direction="row" justify="between" background="light-5" >
            {isLeft ? <>{S}{C}</> : <>{C}{S}</>}
        </Box>)
}