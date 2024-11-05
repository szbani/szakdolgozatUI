//@ts-nocheck
import useWebSocket from "react-use-websocket";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export const Websocket = (socketUrl:string) => {
    const [messageHistory, setMessageHistory] = useState([]);
    const [registeredDisplays, setRegisteredDisplays] = useState<string[]>(['']);
    const [unRegisteredDisplays, setUnRegisteredDisplays] = useState<string[]>(['']);
    const [uploading, setUploading] = useState<boolean>(false);
    const navigate = useNavigate();

    const {
        sendMessage,
        lastMessage,
        readyState
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } = useWebSocket(socketUrl, {
        reconnectInterval: 3000,
        shouldReconnect:
            (closeEvent) => true,
        reconnectAttempts: 3,
        onReconnectStop: () => {
            navigate('/signin');
        },
    });

useEffect(() => {
    if (lastMessage) {
        let parsedMessage;
        console.log('Received message:', lastMessage.data);
        try {
            parsedMessage = JSON.parse(lastMessage.data);
        } catch (e) {
            console.error('Could not parse message', e);
            return
        }

        switch (parsedMessage.type) {
            case 'connectedUsers':
                setRegisteredDisplays(parsedMessage.registeredDisplays);
                setUnRegisteredDisplays(parsedMessage.unRegisteredDisplays);
                // setAdmins(parsedMessage.admins);
                console.log('Connected users:', parsedMessage.registeredDisplays);
                console.log('Connected users:', parsedMessage.unRegisteredDisplays);
                break;
            case'fileArrived':
                setUploading(true);
                break;
            case 'pong':
                console.log('Received pong');
                break;
            default:
                console.log('Unknown message type', parsedMessage.type);
        }
        setMessageHistory((prev) => prev.concat(lastMessage));
    }
}, [lastMessage]);

const getConnectedUsers = () => {
    const jsonToSend = JSON.stringify({type: 'getConnectedUsers'});
    sendMessage(jsonToSend);
}

const sendToUser = (userId: string, message: string) => {
    sendMessage(`sendToUser ${userId} ${message}`);
}

const sendPing = () => {
    sendMessage('ping');
}

return {
    readyState,
    messageHistory,
    getConnectedUsers,
    sendToUser,
    sendPing,
    registeredDisplays,
    unRegisteredDisplays,
    sendMessage,
    uploading,
    setUploading
}
}