//@ts-ignore
import useWebSocket from "react-use-websocket";
import {useEffect, useState} from "react";
import {loadConfig} from "../config.ts";

export const Websocket = () => {
    //@ts-ignore
    const [socketUrl, setSocketUrl] = useState<string>();
    //@ts-ignore
    const [messageHistory, setMessageHistory] = useState([]);
    //@ts-ignore
    const [clients, setClients] = useState<string[]>([]);
    //@ts-ignore
    const [admins, setAdmins] = useState<string[]>([]);
    //@ts-ignore
    const [userMessages, setUserMessages] = useState<{ message: string }[]>([]);

    useEffect(() => {
        const openWebsocket = async () => {
            try {
                const config = await loadConfig();
                try {
                    if (config !== null) {
                        console.log('Connecting to WS');
                        setSocketUrl(`Https://localhost:${config?.websocketPort}`);
                    }
                } catch (error) {
                    console.error('Error connecting to WS:', error);
                }
            } catch (error) {
                console.error('Error loading config:', error);
            }
        }
        openWebsocket();
    }, []);
    const {
        sendMessage,
        lastMessage,
        readyState
    } = useWebSocket(socketUrl, {reconnectInterval: 3000, shouldReconnect: (closeEvent) => true});

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

    const sendFiles = (files: FileList, targetUser: string) => {
        let jsonToSend = JSON.stringify({
            type: 'startFileStream',
            targetUser: targetUser,
        });
        sendMessage(jsonToSend);
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            if (file) {
                const chunkSize = 1024 * 256; // 256KB per chunk
                const fileNameBuffer = new TextEncoder().encode(file.name); // Encode file name to bytes
                const maxFileNameSize = 100;

                const reader = new FileReader();
                let offset = 0;
                let firstChunk = true;

                const readChunk = () => {
                    const chunk = file.slice(offset, offset + chunkSize); // Slice the file
                    reader.readAsArrayBuffer(chunk); // Read the chunk as ArrayBuffer (binary)
                };

                reader.onload = async (event: ProgressEvent<FileReader>) => {
                    if (event.target?.result) {
                        const fileChunkBuffer = event.target.result as ArrayBuffer;
                        // let bufferToSend;
                        // let combinedView;

                        // if(firstChunk){
                        const bufferToSend = new ArrayBuffer(maxFileNameSize + fileChunkBuffer.byteLength);
                        const combinedView = new Uint8Array(bufferToSend);

                        // Fill first 100 bytes with the file name (padded if needed)
                        combinedView.set(fileNameBuffer.slice(0, maxFileNameSize)); // File name
                        // Fill the rest with the file data
                        combinedView.set(new Uint8Array(fileChunkBuffer), maxFileNameSize); // File data
                        // }
                        // else    {
                        //     bufferToSend = new ArrayBuffer(fileChunkBuffer.byteLength);
                        //     combinedView = new Uint8Array(bufferToSend);
                        //     combinedView.set(new Uint8Array(fileChunkBuffer));
                        // }

                        // Send buffer
                        console.log('Sending chunk:', file.name, offset, fileChunkBuffer.byteLength);
                        console.log('Buffer:', bufferToSend);
                        sendMessage(bufferToSend);

                        offset += fileChunkBuffer.byteLength; // Update offset
                        if (offset < file.size) {
                            firstChunk = false;
                            readChunk(); // Continue reading the next chunk
                        } else {
                            // End of file
                            firstChunk = true;
                            const endStreamMessage = JSON.stringify({
                                type: "endFileStream",
                                fileName: file.name
                            });
                            sendMessage(endStreamMessage);
                            console.log('File sent:', file.name); // Log success
                        }
                    }
                };

                reader.onerror = (event) => {
                    console.error('Error reading file:', event);
                };

                // Start reading the first chunk
                readChunk();
            }
        }
    };

    return {
        readyState,
        messageHistory,
        getConnectedUsers,
        sendToUser,
        sendPing,
        clients,
        sendFiles
    }
}