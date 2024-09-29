//@ts-ignore
import useWebSocket from "react-use-websocket";
import {useEffect, useState} from "react";

export const Websocket = () => {
    //@ts-ignore
    const [socketUrl, setSocketUrl] = useState('https://localhost:7010');
    //@ts-ignore
    const [messageHistory, setMessageHistory] = useState([]);
    //@ts-ignore
    const [clients, setClients] = useState<string[]>([]);
    //@ts-ignore
    const [admins, setAdmins] = useState<string[]>([]);
    //@ts-ignore
    const [userMessages, setUserMessages] = useState<{message: string }[]>([]);

    const {
        sendMessage,
        lastMessage,
        readyState,
    } = useWebSocket(socketUrl);

    useEffect(() => {
        if (lastMessage) {
            let parsedMessage;
            console.log('Received message:', lastMessage.data);
            try {
                parsedMessage = JSON.parse(lastMessage.data);
            }catch (e) {
                console.error('Could not parse message', e);
                return
            }

            switch (parsedMessage.type) {
                case 'connectedUsers':

                    setClients(parsedMessage.clients);
                    // setAdmins(parsedMessage.admins);
                    console.log('Connected users:', parsedMessage.clients);
                    console.log('Connected users:', parsedMessage.admins);
                    break;
                case 'messageFromUser':
                    setUserMessages((prev) => prev.concat({
                        // from: parsedMessage.from,
                        message: parsedMessage.message,
                    }));
                    break;
                case 'pong':
                    console.log('Received pong');
                    break;
                default:
                    console.log('Unknown message type', parsedMessage.type);
            }
            //@ts-ignore
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
        clients
    }
}