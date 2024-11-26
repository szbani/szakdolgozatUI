import {ClientWebSocket} from "../../websocket/ClientWebSocketBase.ts";
import Box from "@mui/material/Box";
import Carousel from "react-material-ui-carousel";
import {Key, useEffect, useRef, useState} from "react";
import {loadShowCaseConfig} from "./ShowCaseConfig.ts";
import {slideShowProps} from "../dashboard/clients/ClientUI.tsx";
import {CarouselProps} from "react-material-ui-carousel/dist/components/types";


// @ts-ignore
const SlideShow = (props: slideShowProps) => {
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
    // console.log('SlideShow:', userName);
    // console.log('SlideShow:', props.fileNames);

    return (
        <Carousel autoPlay={true}
                  animation={props.transitionStyle as CarouselProps['animation']}
                  duration={props.transitionDuration * 1000}
                  stopAutoPlayOnHover={false}
                  indicators={false}
                  interval={props.interval * 1000}
                  sx={{height: windowSize.height, width: windowSize.width}}>
            {
                props.fileNames.map((fileName: string | undefined, index: Key | null | undefined) => {
                    return (
                        <img key={index} src={`/${props.clientId}/${fileName}`} alt={fileName}
                             style={{objectFit: props.objectFit, width: windowSize.width, height: windowSize.height}}/>
                    )
                })
            }
        </Carousel>
    )
}

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
            <source src={`/${username}/${fileName}`} type="video/mp4"/>
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
                        fileNames: socket.fileNames as string[],
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
        <Box sx={{cursor: "none", width: '100%', height: '100%'}}>
            {socket.fileNames && socket.fileNames.length > 0 && socket.username !== '' && mediaType === "image" ?
                <SlideShow
                    clientId={slideShowConfig.clientId}
                    fileNames={slideShowConfig.fileNames}
                    transitionStyle={slideShowConfig.transitionStyle}
                    transitionDuration={slideShowConfig.transitionDuration}
                    interval={slideShowConfig.interval}
                    objectFit={slideShowConfig.objectFit}
                /> : null}
            {socket.fileNames && socket.fileNames.length > 0 && socket.username !== '' && mediaType === "video" ?
                <MediaPlayer username={socket.username} fileName={socket.fileNames}/> : null}
        </Box>
    )
}

export default ShowCase;