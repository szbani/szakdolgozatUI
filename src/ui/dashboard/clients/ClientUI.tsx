import Carousel from "react-material-ui-carousel";
import Box from "@mui/material/Box";
import {CardContent, Tab, tabClasses} from "@mui/material";
import {TabList, TabPanel, TabContext} from "@mui/lab";
import {Image, Videocam} from "@mui/icons-material";
import {FileDropZone} from "./FileDropZone.tsx";
import {loadShowCaseConfig} from "../../showcase/ShowCaseConfig.ts";
import {useParams} from "react-router-dom";
import {useWebSocketContext} from "../../../websocket/WebSocketContext.tsx";
import {ChangeEvent, Key, SyntheticEvent, useEffect, useRef, useState} from "react";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

const SlideShow = ({clientId, fileNames}) => {
    console.log('SlideShow:', fileNames);
    return (
            <Carousel autoPlay={true}
                      animation={"slide"}
                      stopAutoPlayOnHover={false}
                      indicators={false}
                      interval={5000}
                      // width={"100%"}
                      height={"600px"}
            >
                {
                    fileNames.map((fileName: string | undefined, index: Key | null | undefined) => {
                        return (
                            <img
                                key={index}
                                src={`/${clientId}/${fileName}`}
                                alt={fileName}
                                style={{width: '100%', height: '600px'}}
                            />
                        )
                    })
                }
            </Carousel>
    )
}

const CurrentlyPlaying = () => {

    // @ts-ignore
    const {getFilesOfUser, fileNames} = useWebSocketContext();
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
            // console.log('loadConfig:', clientId);
            if (clientId !== undefined) {
                const config = await loadShowCaseConfig(clientId);
                if (config !== null) {
                    setMediaType(config?.mediaType);
                }
            }
            // console.log('config:', config);
        } catch (error) {
            console.error('Error loading config:', error);
        }
    }

    return (
        <Box marginBottom={4}>
            <Grid container spacing={4}>
                <Grid size={{xs: 12, sm: 6, md: 6, lg: 6.5, xl: 7}}>
                    <Card>
                        <CardHeader
                            title={<Typography
                                fontSize={24}
                                fontWeight={"bold"}>
                                Currently Playing {mediaType}
                            </Typography>}
                            sx={{padding: 1, paddingTop: 0}}
                        />
                        <CardContent>
                            {
                                fileNames.length == 0 ?
                                    <p>No content currently shown.</p> :
                                    mediaType == 'image' ?
                                        <SlideShow fileNames={fileNames} clientId={clientId}/>
                                        : mediaType == 'video' ? fileNames.map((fileName: string, index: Key) => {
                                            return (
                                                <video key={index} ref={videoRef} muted controls autoPlay loop style={{objectFit:"cover", width:"100%"}}>
                                                    <source src={`/${clientId}/${fileName}`} type="video/mp4"/>
                                                </video>
                                            )
                                        }) : <p>Unknown media type</p>
                            }
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 6, lg: 5.5, xl: 5}}>
                    <Card>
                        <CardHeader
                            title={<Typography
                                fontSize={24}
                                fontWeight={"bold"}>
                                Currently Playing {mediaType}
                            </Typography>}
                            sx={{padding: 1, paddingTop: 0}}
                        />
                        <CardContent>
                            <ul>
                                {fileNames.map((fileName: string, index: Key) => {
                                    return <li key={index}>{fileName}</li>
                                })}
                            </ul>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

        </Box>
    )
}

const ClientUI = () => {
    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    }

    return (
        <Box>
            <CurrentlyPlaying/>
            <TabContext value={tabIndex}>
                <TabList
                    onChange={handleChange}
                    sx={{
                        p: 0.5,
                        gap: 0.5,
                        borderRadius: 'xl',
                        bgcolor: 'background.level1',
                        [`& .${tabClasses.root}[aria-selected="true"]`]: {
                            boxShadow: 'sm',
                            bgcolor: 'background.surface',
                            disableIndicator: "true"
                        },
                    }}
                >
                    <Tab
                        icon={<Image/>}
                        label={"Images"}
                        value={0}
                    >
                    </Tab>
                    <Tab
                        icon={<Videocam/>}
                        label={"Video"}
                        value={1}
                    >
                    </Tab>
                </TabList>
                <TabPanel value={0}><FileDropZone acceptedFileType={'image'}/></TabPanel>
                <TabPanel value={1}><FileDropZone acceptedFileType={'video'}/></TabPanel>
            </TabContext>
        </Box>
    )
}

export default ClientUI;