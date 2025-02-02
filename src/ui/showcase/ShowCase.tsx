import {ClientWebSocket} from "../../websocket/ClientWebSocketBase.ts";
import Box from "@mui/material/Box";
import {useEffect, useRef, useState} from "react";
import {loadShowCaseConfig} from "./ShowCaseConfig.ts";
import {slideShowProps} from "../dashboard/client/ClientUI.tsx";
import ShowCaseSwiper from "./ShowCaseSwiper.tsx";

// @ts-ignore
const MediaPlayer = ({username, fileName}) => {
    const [windowSize, setWindowSize] = useState({width: window.innerWidth, height: window.innerHeight});
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({width: window.innerWidth, height: window.innerHeight});
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
        }
        console.log('MediaPlayer:', fileName);
    }, [fileName]);

    return (
        <video ref={videoRef} muted controls autoPlay loop style={{width: windowSize.width, height: windowSize.height}}>
            <source src={`displays/${username}/${fileName}`} type="video/mp4"/>
        </video>
    )
}

const ShowCase = () => {
    const socket = ClientWebSocket();
    const [mediaType, setMediaType] = useState<string>('');
    const [slideShowConfig, setSlideShowConfig] = useState<slideShowProps>({
        clientId: "",
        fileNames: [],
        transitionStyle: "slide",
        transitionDuration: 1,
        interval: 5000,
        objectFit: "fill",
    });

    const [windowSize, setWindowSize] = useState({width: window.innerWidth, height: window.innerHeight});
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({width: window.innerWidth, height: window.innerHeight});
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    // @ts-ignore
    useEffect(() => {
        if (socket.newConfig) {
            loadConfig(socket.username);
            socket.setNewConfig(false);
        }
    }, [socket.newConfig]);

    useEffect(() => {
        if (socket.username !== '') {
            socket.getFileForUser();
        }
    }, [socket.username]);

    const loadConfig = async (userId: string) => {
        try {
            console.log('loadConfig:', userId);
            const config = await loadShowCaseConfig(userId);
            console.log('config:', config);
            if (config !== null) {
                setMediaType(config?.mediaType);
                if (config?.mediaType === "image") {
                    setSlideShowConfig({
                        clientId: userId,
                        fileNames: config?.imagePaths,
                        transitionStyle: config?.transitionStyle,
                        transitionDuration: config?.transitionDuration,
                        interval: config?.imageInterval,
                        // @ts-ignore
                        objectFit: config?.imageFit,
                    });
                }

            }
        } catch (error) {
            console.error('Error loading config:', error);
        }
    }

    useEffect(() => {

        if (socket.fileNames && socket.fileNames.length > 0) {
            loadConfig(socket.username);
            console.log('ConfigLoaded');
            console.log("mediaType:", mediaType);
        }
    }, [socket.fileNames]);


    return (
        <Box sx={{cursor: "none", width: '100%', height: windowSize}}>
            {socket.fileNames && socket.fileNames.length > 0 && socket.username !== '' && mediaType === "image" ?
                <ShowCaseSwiper
                    {...slideShowConfig}
                /> : null}
            {socket.fileNames && socket.fileNames.length > 0 && socket.username !== '' && mediaType === "video" ?
                <MediaPlayer username={socket.username} fileName={socket.fileNames}/> : null}
        </Box>
    )
}

export default ShowCase;