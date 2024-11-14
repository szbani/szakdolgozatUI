//@ts-nocheck
import Box from "@mui/joy/Box";
import {Tab, tabClasses, TabList, TabPanel, Tabs} from "@mui/joy";
import {Image, Videocam} from "@mui/icons-material";
import {FileDropZone} from "./FileDropZone.tsx";
import {loadShowCaseConfig} from "../../showcase/ShowCaseConfig.ts";
import {useParams} from "react-router-dom";
import {useWebSocketContext} from "../../../websocket/WebSocketContext.tsx";
import {Key, useEffect, useRef, useState} from "react";

const CurrentlyPlaying = () => {

    const {getFilesOfUser,fileNames} = useWebSocketContext();
    const {clientId} = useParams();
    const [mediaType, setMediaType] = useState<string>('');
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        getFilesOfUser(clientId);
    }, [clientId]);
    useEffect(() => {
        loadConfig();
    }, [fileNames]);
    useEffect(() => {
        if (videoRef.current && mediaType == 'video') {
            videoRef.current.load();
        }
    }, [mediaType, fileNames]);

    const loadConfig = async () => {
        try {
            console.log('loadConfig:', clientId);
            const config = await loadShowCaseConfig(clientId);
            console.log('config:',config);
            if (config !== null) {
                setMediaType(config?.mediaType);
            }
        } catch (error) {
            console.error('Error loading config:', error);
        }
    }

    return (
        <Box>
            <h1>Currently Playing</h1>
            <p>Media type: {mediaType}</p>
            {fileNames.length == 0 ? <p>No content currently shown.</p>:
                mediaType == 'image' ? fileNames.map((fileName : string, index: Key) => {
                    return <img key={index} src={`/${clientId}/${fileName}`} alt={fileName} width={"200px"}/>
                }): mediaType == 'video' ? fileNames.map((fileName : string, index: Key) => {
                    return(
                    <video key={index} ref={videoRef} muted controls autoPlay loop height={"200px"}>
                        <source src={`/${clientId}/${fileName}`} type="video/mp4"/>
                    </video>
                    )
                }) : <p>Unknown media type</p>
            }
        </Box>
    )
}

const ClientUI = () => {
    return (
        <Box>
            <CurrentlyPlaying/>
            <Tabs orientation="horizontal" defaultValue={0}>
                <TabList
                    sx={{
                        p: 0.5,
                        gap: 0.5,
                        borderRadius: 'xl',
                        bgcolor: 'background.level1',
                        [`& .${tabClasses.root}[aria-selected="true"]`]: {
                            boxShadow: 'sm',
                            bgcolor: 'background.surface',
                            disableIndicator:"true"
                        },
                    }}>
                    <Tab
                        disableIndicator
                        variant="soft">
                        <Image/>Images
                    </Tab>
                    <Tab
                        disableIndicator
                        variant="soft">
                        <Videocam/>Video
                    </Tab>
                </TabList>
                <TabPanel value={0}><FileDropZone acceptedFileType={'image'}/></TabPanel>
                <TabPanel value={1}><FileDropZone acceptedFileType={'video'}/></TabPanel>
            </Tabs>
        </Box>
    )
}

export default ClientUI;