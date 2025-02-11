import {ClientWebSocket} from "../../websocket/ClientWebSocketBase.ts";
import Box from "@mui/material/Box";
import {useEffect, useRef, useState} from "react";
import {loadShowCaseConfig} from "./ShowCaseConfig.ts";
import {slideShowProps} from "../dashboard/client/ClientUI.tsx";
import ShowCaseSwiper from "./ShowCaseSwiper.tsx";

// @ts-ignore
const MediaPlayer = ({username, fileName, changeTime}) => {
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
            <source src={`displays/${username}/${changeTime}/${fileName}`} type="video/mp4"/>
        </video>
    )
}

const ShowCase = () => {
    const socket = ClientWebSocket();
    const [slideShowConfig, setSlideShowConfig] = useState<slideShowProps>({
        mediaType: "image",
        clientId: "",
        fileNames: [],
        transitionStyle: "slide",
        transitionDuration: 1,
        interval: 5000,
        objectFit: "fill",
        changeTime: "default"
    });

    let now = new Date();
    let changeTime = new Date();

    const startCountDownTillChange = () => {
        const countDown = setInterval(() => {
            const diff = changeTime.getTime() - now.getTime();
            // console.log('diff:', diff);
            // console.log('changeTime:', changeTime);
            now = new Date();
            if (diff <= 0) {
                clearInterval(countDown);
                loadConfig(socket.username);
            }
        }, 10000);
    }


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
            loadConfig(socket.username);
        }
    }, [socket.username]);

    const loadConfig = async (userId: string) => {
        try {
            now = new Date();
            console.log('loadConfig:', userId);
            const config = await loadShowCaseConfig(userId);
            console.log('config:', config);
            if (config !== null) {
                let fileNamesTime = "default";
                if (config.changeTimes.length > 0) {
                    for (let i = 0; i < config.changeTimes.length; i++) {
                        const hour = config.changeTimes[i].split(":").map(Number)[0];
                        const minute = config.changeTimes[i].split(":").map(Number)[1];

                        const startTime = new Date();
                        startTime.setHours(hour, minute, 0, 0);
                        const recurzive = (currentI: number) => {
                            if (now.getHours() > startTime.getHours() || (now.getHours() === startTime.getHours() && now.getMinutes() >= startTime.getMinutes())) {

                            const current = config.changeTimes[currentI];
                                // @ts-ignore
                            const endHour = config?.[current].endTime.split(":").map(Number)[0];
                                // @ts-ignore
                            const endMinute = config?.[current].endTime.split(":").map(Number)[1];
                            const endTime = new Date();
                            endTime.setHours(endHour, endMinute, 0, 0);

                                if (now.getHours() < endTime.getHours() || (now.getHours() === endTime.getHours() && now.getMinutes() < endTime.getMinutes())) {
                                    fileNamesTime = config.changeTimes[currentI];

                                    if (currentI < config.changeTimes.length - 1) {
                                        const nextPlanedChange = config.changeTimes[currentI];
                                        const hour = nextPlanedChange.split(":").map(Number)[0];
                                        const minute = nextPlanedChange.split(":").map(Number)[1];
                                        const nextPlanedChangeTime = new Date();
                                        nextPlanedChangeTime.setHours(hour, minute, 0, 0);
                                        // @ts-ignore
                                        const endhour = config?.[nextPlanedChange].endTime.split(":").map(Number)[0];
                                        // @ts-ignore
                                        const endminute = config?.[nextPlanedChange].endTime.split(":").map(Number)[1];
                                        const nextPlanedChangeEndTime = new Date();
                                        nextPlanedChangeEndTime.setHours(endhour, endminute, 0, 0);

                                        if (now.getHours() < nextPlanedChangeTime.getHours() || (now.getHours() === nextPlanedChangeTime.getHours() && now.getMinutes() < nextPlanedChangeTime.getMinutes())) {
                                            // changeTime = nextPlanedChangeTime;
                                            recurzive(currentI);
                                        } else {
                                            // @ts-ignore
                                            changeTime = endTime;
                                        }
                                    } else {
                                        // @ts-ignore
                                        changeTime = endTime;
                                    }
                                    console.log('changeTime:', changeTime);
                                    startCountDownTillChange();
                                }
                            }
                        }
                        recurzive(i)
                    }
                }
                // @ts-ignore
                if (config?.[fileNamesTime].mediaType === "image") {
                    setSlideShowConfig({
                        mediaType: "image",
                        clientId: userId,
                        // @ts-ignore
                        fileNames: config?.[fileNamesTime].paths,
                        transitionStyle: config?.transitionStyle,
                        transitionDuration: config?.transitionDuration,
                        interval: config?.imageInterval,
                        // @ts-ignore
                        objectFit: config?.imageFit,
                        changeTime: fileNamesTime,
                    });
                    // @ts-ignore
                }else if (config?.[fileNamesTime].mediaType === "video"){
                    setSlideShowConfig({
                        mediaType: "video",
                        clientId: userId,
                        // @ts-ignore
                        fileNames: config?.[fileNamesTime].paths,
                        changeTime: fileNamesTime,
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
        }
    }, [socket.fileNames]);


    return (
        <Box sx={{cursor: "none", width: '100%', height: windowSize}}>
            {slideShowConfig.fileNames && slideShowConfig.fileNames.length > 0 && slideShowConfig.clientId !== '' && slideShowConfig.mediaType === "image" ?
                <ShowCaseSwiper
                    {...slideShowConfig}
                /> : null}
            {slideShowConfig.fileNames && slideShowConfig.fileNames.length > 0 && slideShowConfig.clientId !== '' && slideShowConfig.mediaType === "video" ?
                <MediaPlayer username={socket.username} fileName={slideShowConfig.fileNames} changeTime={slideShowConfig.changeTime}/> : null}
        </Box>
    )
}

export default ShowCase;