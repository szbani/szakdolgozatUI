//@ts-nocheck
import useWebSocket from "react-use-websocket";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {SnackbarProps} from "../ui/dashboard/components/Snackbars.tsx";

export const Websocket = (socketUrl: string) => {
    const [messageHistory, setMessageHistory] = useState([]);
    const [registeredDisplays, setRegisteredDisplays] = useState<string[]>(['']);
    const [unRegisteredDisplays, setUnRegisteredDisplays] = useState<string[]>(['']);
    const [uploading, setUploading] = useState<boolean>(false);
    const navigate = useNavigate();
    const [fileNames, setFileNames] = useState([""]);
    const loggedIn = sessionStorage.getItem('loggedIn');

    const [newConfig, setNewConfig] = useState<boolean>(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarProps, setSnackbarProps] = useState<SnackbarProps>({
        setOpen: () => {
        },
        open: false,
        message: '',
        status: 'info',
    });

    if (!loggedIn) {
        navigate('/signin');
    }
    useEffect(() => {
        if (!snackbarOpen) {
            setSnackbarProps({
                setOpen: setSnackbarOpen,
                open: false,
                message: '',
                status: 'info',
            });
        }
    }, [snackbarOpen]);

    useEffect(() => {
        if (!loggedIn) {
            navigate('/signin');
        }
    }, []);

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
                    // console.log('File arrived:', parsedMessage.content);
                    break;
                case 'pong':
                    console.log('Received pong');
                    break;
                case 'filesForUser':
                    // console.log('Files for user:', parsedMessage.files);
                    setFileNames(parsedMessage.content);
                    break;
                case 'Error':
                    // console.log('Error:', parsedMessage.content);
                    setSnackbarOpen(true);
                    setSnackbarProps({
                        setOpen: setSnackbarOpen,
                        open: true,
                        message: parsedMessage.content,
                        status: 'error',
                    });
                    break;
                case "fileStreamStarted":
                    // console.log('File stream started:', parsedMessage.content);
                    break;
                case 'Success':
                    // console.log('Success:', parsedMessage.content);
                    setSnackbarOpen(true);
                    setSnackbarProps({
                        setOpen: setSnackbarOpen,
                        open: true,
                        message: parsedMessage.content,
                        status: 'success',
                    });
                    break;
                case "ConfigUpdated":
                    setNewConfig(true);
                    setSnackbarOpen(true);
                    setSnackbarProps({
                        setOpen: setSnackbarOpen,
                        open: true,
                        message: parsedMessage.content,
                        status: 'success',
                    });
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
    const getFilesOfUser = (targetUser: string) => {
        sendMessage(JSON.stringify({type: 'getFilesForUser', targetUser: targetUser}));
    }

    return {
        fileNames,
        readyState,
        messageHistory,
        getFilesOfUser,
        getConnectedUsers,
        registeredDisplays,
        unRegisteredDisplays,
        sendMessage,
        uploading,
        setUploading,
        snackbarProps,
        setNewConfig,
        newConfig
    }
}