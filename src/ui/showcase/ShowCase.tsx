import {ClientWebSocket} from "../../websocket/ClientWebSocketBase.ts";
import Box from "@mui/joy/Box";
import Carousel from "react-material-ui-carousel";
import {Key, useEffect, useState} from "react";
import {loadShowCaseConfig} from "./ShowCaseConfig.ts";

// @ts-ignore
const SlideShow = ({userName, fileNames}) => {
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
    // console.log('SlideShow:', fileNames);

    return (
        <Carousel autoPlay={true} animation={"slide"} stopAutoPlayOnHover={false} indicators={false}
                  interval={5000}
                  sx={{height: windowSize.height, width: windowSize.width}}>
            {
                fileNames.map((fileName: string | undefined, index: Key | null | undefined) => {
                    return (
                        <img key={index} src={`/${userName}/${fileName}`} alt={fileName}
                             style={{width: windowSize.width, height: windowSize.height}}/>
                    )
                })
            }
        </Carousel>
    )
}

// @ts-ignore
const MediaPlayer = ({username, fileName}) => {
    return (
        <video controls autoPlay loop style={{width: '100%', height: '100%'}}>
            <source src={`/${username}/${fileName}`} type="video/mp4"/>
        </video>
    )
}

const ShowCase = () => {
    const socket = ClientWebSocket();
    const [mediaType, setMediaType] = useState<string>('');



    useEffect(() => {
        if (socket.username !== '') {
            socket.getFileForUser();
        }
    }, [socket.username]);

    const loadConfig = async (userId: string) => {
        try {
            console.log('loadConfig:', userId);
            const config = await loadShowCaseConfig(userId);
            console.log('config:',config);
            if (config !== null) {
                setMediaType(config?.mediaType);
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
            {/*<VideoPlayer/>*/}
            {/*<h1>{filePath}</h1>*/}
            {socket.fileNames && socket.fileNames.length > 0 && socket.username !== '' && mediaType === "image" ?
                <SlideShow userName={socket.username} fileNames={socket.fileNames}/> : null}
            {socket.fileNames && socket.fileNames.length > 0 && socket.username !== '' && mediaType === "video" ?
                <MediaPlayer username={socket.username} fileName={socket.fileNames}></MediaPlayer> : null}
        </Box>
    )
}

export default ShowCase;