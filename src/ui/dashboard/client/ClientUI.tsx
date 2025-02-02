import Box from "@mui/material/Box";
import {Tab, tabClasses} from "@mui/material";
import {TabList, TabPanel, TabContext} from "@mui/lab";
import {Image, Videocam} from "@mui/icons-material";
import {FileDropZone} from "./FileDropZone.tsx";
import {loadShowCaseConfig} from "../../showcase/ShowCaseConfig.ts";
import {useParams} from "react-router-dom";
import {useWebSocketContext} from "../../../websocket/WebSocketContext.tsx";
import {SyntheticEvent, useEffect, useState} from "react";
import Grid from "@mui/material/Grid2";
import ActionsTiming from "./ActionsTiming.tsx";
import CurrentConfiguration from "./CurrentConfiguration.tsx";
import CurrentPlaying from "./CurrentPlaying.tsx";
import PictureOrder from "./PictureOrder.tsx";
import UploadModal from "./UploadModal.tsx";

type ObjectFit = "contain" | "cover" | "fill" | "none" | "scale-down";

export interface slideShowProps {
    mediaType?:string,
    clientId: string,
    fileNames: string[],
    transitionStyle: string,
    transitionDuration: number,
    interval: number,
    objectFit: ObjectFit,
}

const CurrentActions = (slideShowConfig:slideShowProps) => {

    // @ts-ignore

    return (
        <Box marginBottom={4}>
            <Grid container spacing={4}>
                <Grid size={{xs: 12, sm: 12, md: 6, lg: 6.5, xl: 7}}>
                    <CurrentPlaying {...slideShowConfig}></CurrentPlaying>
                </Grid>
                <Grid size={{xs: 12, sm: 12, md: 6, lg: 5.5, xl: 5}}>
                    <CurrentConfiguration {...slideShowConfig}></CurrentConfiguration>
                    <UploadModal {...slideShowConfig}></UploadModal>
                </Grid>
            </Grid>
        </Box>
    )
}

const ClientUI = () => {
    const [tabIndex, setTabIndex] = useState(0);

    // @ts-ignore
    const { fileNames, setNewConfig, newConfig} = useWebSocketContext();
    const {clientId} = useParams();
    const [slideShowConfig, setSlideShowConfig] = useState<slideShowProps>({
        mediaType: "image",
        clientId: "",
        transitionStyle: "slide",
        transitionDuration: 1,
        interval: 5,
        objectFit: "fill",
        fileNames: []
    });

    useEffect(() => {
        if (newConfig) setNewConfig(false);
        loadConfig();
    }, [fileNames,newConfig]);

    const loadConfig = async () => {
        try {
            // console.log('loadConfig:', clientId);
            if (clientId !== undefined) {
                try {
                    const config = await loadShowCaseConfig(clientId);
                    if (config !== null) {
                        // if (config.mediaType == 'image') {
                        setSlideShowConfig({
                            mediaType: config.mediaType,
                            clientId: clientId,
                            fileNames: config.imagePaths || [],
                            transitionStyle: config?.transitionStyle || 'slide',
                            transitionDuration: config?.transitionDuration || 1,
                            interval: config?.imageInterval || 5,
                            objectFit: config?.imageFit as ObjectFit || 'fill' as ObjectFit
                        });
                        // }
                    }
                }catch (e) {
                    setSlideShowConfig({
                        mediaType: "image",
                        clientId: clientId,
                        fileNames: [],
                        transitionStyle: "slide",
                        transitionDuration: 1,
                        interval: 5,
                        objectFit: "fill",
                    });
                }
            }
            // console.log('config:', config);
        } catch (error) {
            console.error('Error loading config:', error);
        }
    }


    // @ts-ignore
    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    }

    return (
        <Box>
            <CurrentActions {...slideShowConfig}/>
            <ActionsTiming></ActionsTiming>
        </Box>
    )
}

export default ClientUI;