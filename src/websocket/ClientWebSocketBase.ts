import useWebSocket from "react-use-websocket";
import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";

export const ClientWebSocket = (user : string) => {
    const [socketUrl, setSocketUrl] = useState('https://localhost:7010');
    const [messageHistory, setMessageHistory] = useState([]);
    const [userMessages, setUserMessages] = useState<{message: string }[]>([]);

    const [searchParams] = useSearchParams();
    const [username, setUsername] = useState('');

    useEffect(() => {
        const username = searchParams.get('username') ? searchParams.get('username') : null;
        if (username !== null) {
            setUsername(username);
            console.log('Connecting to WS with username:', username);
            setSocketUrl('https://localhost:7010?user=' + username);
        }else{
            console.log('Cant Connect To WS');
        }
    }, [searchParams]);


    const {
        sendMessage,
        lastMessage,
        readyState,
    } = useWebSocket(socketUrl);

    useEffect(() => {

    }, [lastMessage]);



    return {
        sendMessage,
        lastMessage,
        readyState,
        messageHistory,
        userMessages
    }
}