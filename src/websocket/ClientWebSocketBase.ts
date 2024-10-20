//@ts-nocheck
import useWebSocket from "react-use-websocket";
import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {loadConfig} from "../config.ts";

export const ClientWebSocket = () => {
    const [socketUrl, setSocketUrl] = useState<string>();
    const [messageHistory, setMessageHistory] = useState([]);
    const [userMessages, setUserMessages] = useState<{ message: string }[]>([]);

    const [searchParams] = useSearchParams();
    const [username, setUsername] = useState('');

    const [fileNames, setFileNames] = useState<string[]>();
    useEffect(() => {
        const openWebsocket = async () => {
            try {
                const config = await loadConfig();
                const username = searchParams.get('username') ? searchParams.get('username') : null;
                try {
                    console.log('config:', config?.websocket);
                    if (username !== null && config?.websocket != null) {
                        setUsername(username);
                        console.log('Connecting to WS with username:', username);
                        setSocketUrl(config?.websocket+"?user="+username);
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
    } = useWebSocket(socketUrl, { reconnectInterval: 3000, shouldReconnect: (closeEvent) => true});

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
                case 'filesForUser':
                    setFileNames(parsedMessage.content);
                    console.log('Received files:', parsedMessage.content);
                    break;
                case "updateRequest":
                    console.log('Received update request');
                    getFileForUser();
                    break;
                case 'messageFromUser':
                    setUserMessages((prev) => prev.concat({
                        message: parsedMessage.message,
                    }));
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

    const getFileForUser = () => {
        sendMessage(JSON.stringify({type: 'getFilesForUser', targetUser: username}));
    }


    return {
        sendMessage,
        lastMessage,
        readyState,
        messageHistory,
        userMessages,
        username,
        getFileForUser,
        fileNames
    }
}