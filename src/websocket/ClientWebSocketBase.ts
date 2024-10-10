import useWebSocket from "react-use-websocket";
import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {loadConfig} from "../config.ts";

export const ClientWebSocket = () => {
    const [socketUrl, setSocketUrl] = useState<string>();
    const [messageHistory, setMessageHistory] = useState([]);
    const [userMessages, setUserMessages] = useState<{ message: string }[]>([]);
    const [fileTransfer, setFileTransfer] = useState(false)


    const [searchParams] = useSearchParams();
    const [username, setUsername] = useState('');

    useEffect(() => {
        const openWebsocket = async () => {
            try {
                const config = await loadConfig();
                const username = searchParams.get('username') ? searchParams.get('username') : null;
                try {
                    console.log('config:', config?.websocketPort);
                    if (username !== null && config?.websocketPort != null) {
                        setUsername(username);
                        console.log('Connecting to WS with username:', username);
                        setSocketUrl(`https://localhost:${config?.websocketPort}?user=${username}`);
                        // console.log('Socket URL:', socketUrl);
                    } else {
                        console.log('Cant Connect To WS');
                    }
                } catch (error) {
                    console.error('Error connecting to WS:', error);
                }
            } catch (error) {
                console.error('Error loading config:', error);
            }
        }
        openWebsocket()
    }, [searchParams]);


    const {
        sendMessage,
        lastMessage,
        readyState,
    } = useWebSocket(socketUrl, {reconnectInterval: 3000, shouldReconnect: (closeEvent) => true});

    useEffect(() => {
        if (lastMessage) {
            let parsedMessage;
            if (fileTransfer) {
                console.log('File Transfer');
                // FileReader.readAsArrayBuffer(lastMessage.data);
                return
            }
            console.log('Received message:', lastMessage.data);
            try {
                parsedMessage = JSON.parse(lastMessage.data);
            } catch (e) {
                console.error('Could not parse message', e);
                return
            }

            switch (parsedMessage.type) {
                case 'messageFromUser':
                    setUserMessages((prev) => prev.concat({
                        message: parsedMessage.message,
                    }));
                    break;
                case 'startFileStream':
                    setFileTransfer(true);
                    break;
                case 'endFileStream':
                    setFileTransfer(false);
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


    return {
        sendMessage,
        lastMessage,
        readyState,
        messageHistory,
        userMessages
    }
}