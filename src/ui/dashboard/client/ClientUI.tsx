import Carousel from "react-material-ui-carousel";
import Box from "@mui/material/Box";
import {CardContent, InputLabel, Select, SelectChangeEvent, Slider, Tab, tabClasses} from "@mui/material";
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
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import {CarouselProps} from "react-material-ui-carousel/dist/components/types";

type ObjectFit = "contain" | "cover" | "fill" | "none" | "scale-down";

export interface slideShowProps {
    clientId: string,
    fileNames: string[],
    transitionStyle: string,
    transitionDuration: number,
    interval: number,
    objectFit: ObjectFit,
}

const SlideShow = (props: slideShowProps) => {
    return (
        <Carousel autoPlay={true}
                  animation={props.transitionStyle as CarouselProps["animation"]}
                  duration={props.transitionDuration}
                  stopAutoPlayOnHover={false}
                  indicators={false}
                  interval={props.interval}
                  height={"500px"}
        >
            {
                props.fileNames.map((fileName: string | undefined, index: Key | null | undefined) => {
                    return (
                        <img
                            key={index}
                            src={`/${props.clientId}/${fileName}`}
                            alt={fileName}
                            style={{objectFit: props.objectFit, width: "100%", height: '500px'}}
                        />
                    )
                })
            }
        </Carousel>
    )
}

const CurrentlyPlaying = () => {

    // @ts-ignore
    const {getFilesOfUser, fileNames, sendMessage, setNewConfig, newConfig} = useWebSocketContext();
    const {clientId} = useParams();
    const [mediaType, setMediaType] = useState<string>('');
    const videoRef = useRef<HTMLVideoElement>(null);
    const [slideShowConfig, setSlideShowConfig] = useState<slideShowProps>({
        clientId: "",
        fileNames: [],
        transitionStyle: "slide",
        transitionDuration: 1,
        interval: 5000,
        objectFit: "fill",
    });

    useEffect(() => {
        getFilesOfUser(clientId);
    }, [clientId]);
    useEffect(() => {
        if (newConfig) setNewConfig(false);
        loadConfig();
    }, [fileNames,newConfig]);
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
                    if (config.mediaType == 'image') {
                        setSlideShowConfig({
                            clientId: clientId,
                            fileNames: fileNames,
                            transitionStyle: config?.transitionStyle || 'slide',
                            transitionDuration: config?.transitionDuration || 1,
                            interval: config?.imageInterval || 5,
                            objectFit: config?.imageFit as ObjectFit || 'fill' as ObjectFit
                        });
                        setImageFit(config?.imageFit || 'fill');
                        setTransitionStyle(config?.transitionStyle || 'fade');
                        setTransitionDuration(config?.transitionDuration || 1);
                        setImageInterval(config?.imageInterval || 5);
                    }
                }
            }
            // console.log('config:', config);
        } catch (error) {
            console.error('Error loading config:', error);
        }
    }

    //configuration handlers
    const [imageFit, setImageFit] = useState<string>('cover');
    const [transitionStyle, setTransitionStyle] = useState<string>('fade');
    const [transitionDuration, setTransitionDuration] = useState<number>(1);
    const [imageInterval, setImageInterval] = useState<number>(5);

    const handleImageFitChange = (event: SelectChangeEvent) => {
        setImageFit(event.target.value);
    }

    const handleTransitionStyleChange = (event: SelectChangeEvent) => {
        setTransitionStyle(event.target.value);
    }

    // @ts-ignore
    const handleTransitionDurationChange = (event: ChangeEvent<{}>, value: number | number[]) => {
        setTransitionDuration(value as number);
    }

    // @ts-ignore
    const handleImageIntervalChange = (event: ChangeEvent<{}>, value: number | number[]) => {
        setImageInterval(value as number);
    }

    const handleSaveConfiguration = () => {
        console.log('Save Configuration');
        const jsonToSend = JSON.stringify({
            type: 'ModifyShowcaseConfiguration',
            targetUser: clientId,
            mediaType: mediaType,
            transitionStyle: transitionStyle,
            transitionDuration: transitionDuration,
            imageFit: imageFit,
            imageInterval: imageInterval
        });

        sendMessage(jsonToSend);
    }

    return (
        <Box marginBottom={4}>
            <Grid container spacing={4}>
                <Grid size={{xs: 12, sm: 12, md: 6, lg: 6.5, xl: 7}}>
                    <Card sx={{minHeight: {sx:320, md:470, lg:320}}}>
                        <CardHeader
                            title={<Typography
                                fontSize={24}
                                fontWeight={"bold"}>
                                Currently Playing {mediaType}
                            </Typography>}
                            sx={{padding: 2, paddingBottom: 0}}
                        />
                        <CardContent>
                            {
                                fileNames.length == 0 ?
                                    <p>No content currently shown.</p> :
                                    mediaType == 'image' ?
                                        <SlideShow
                                            clientId={slideShowConfig.clientId}
                                            fileNames={slideShowConfig.fileNames}
                                            transitionDuration={slideShowConfig.transitionDuration * 1000}
                                            transitionStyle={slideShowConfig.transitionStyle}
                                            objectFit={slideShowConfig.objectFit}
                                            interval={slideShowConfig.interval * 1000}/>
                                        : mediaType == 'video' ? fileNames.map((fileName: string, index: Key) => {
                                            return (
                                                <video key={index} ref={videoRef} muted controls autoPlay loop
                                                       style={{objectFit: "cover", width: "100%"}}>
                                                    <source src={`/${clientId}/${fileName}`} type="video/mp4"/>
                                                </video>
                                            )
                                        }) : <p>Unknown media type</p>
                            }
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{xs: 12, sm: 12, md: 6, lg: 5.5, xl: 5}}>
                    <Card sx={{minHeight: {sx:320, md:470, lg:320}}}>
                        <CardHeader
                            title={<Typography
                                fontSize={24}
                                fontWeight={"bold"}>
                                Current Configuration
                            </Typography>}
                            sx={{padding: 2, paddingLeft: 3, paddingBottom: 0}}
                        />
                        <CardContent
                            sx={{padding: 2, paddingLeft: 3}}
                        >
                            <Box
                                sx={{
                                    display: {xs: "block", sm: "flex", md: "block", lg: "flex"},
                                    alignItems: "center",
                                    marginBottom: 2,
                                    gap: 4
                                }}
                            >
                                <Box>
                                    <InputLabel id={"transition-style-select-label"}>Transition Style</InputLabel>
                                    <Select
                                        labelId={"transition-style-select-label"}
                                        id={"transition-style-select"}
                                        defaultValue={"fade"}
                                        value={transitionStyle}
                                        label="Transition Style"
                                        onChange={handleTransitionStyleChange}
                                        disabled={mediaType !== 'image'}
                                    >
                                        <MenuItem value={"fade"}>Fade</MenuItem>
                                        <MenuItem value={"slide"}>Slide</MenuItem>
                                    </Select>
                                </Box>
                                <Box width={250}>
                                    <InputLabel>Transition Duration</InputLabel>
                                    <Slider
                                        aria-labelledby="discrete-slider"
                                        valueLabelDisplay="auto"
                                        step={1}
                                        marks
                                        min={1}
                                        max={5}
                                        // @ts-ignore
                                        onChange={handleTransitionDurationChange}
                                        value={transitionDuration}
                                        disabled={mediaType !== 'image'}
                                    />
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: {xs: "block", sm: "flex", md: "block", lg: "flex"},
                                    alignItems: "center",
                                    marginBottom: 2,
                                    gap: 6
                                }}
                            >
                                <Box>
                                    <InputLabel id={"image-fit-select-label"}>Image Fit</InputLabel>
                                    <Select
                                        labelId={"image-fit-select-label"}
                                        id={"image-fit-select"}
                                        defaultValue={"cover"}
                                        value={imageFit}
                                        label="Image Fit"
                                        onChange={handleImageFitChange}
                                        disabled={mediaType !== 'image'}
                                    >
                                        <MenuItem value={"cover"}>Cover</MenuItem>
                                        <MenuItem value={"contain"}>Contain</MenuItem>
                                        <MenuItem value={"fill"}>Fill</MenuItem>
                                        <MenuItem value={"none"}>None</MenuItem>
                                        <MenuItem value={"scale-down"}>Scale Down</MenuItem>
                                    </Select>
                                </Box>
                                <Box width={250}>
                                    <Typography>
                                        Image Interval
                                    </Typography>
                                    <Slider
                                        aria-labelledby="discrete-slider"
                                        valueLabelDisplay="auto"
                                        step={1}
                                        marks
                                        min={1}
                                        max={15}
                                        // @ts-ignore
                                        onChange={handleImageIntervalChange}
                                        value={imageInterval}
                                        disabled={mediaType !== 'image'}
                                    />
                                </Box>
                            </Box>
                            <Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={mediaType !== 'image'}
                                    onClick={handleSaveConfiguration}
                                >
                                    Save Configuration
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

        </Box>
    )
}

const ClientUI = () => {
    const [tabIndex, setTabIndex] = useState(0);

    // @ts-ignore
    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    }

    return (
        <Box>
            <CurrentlyPlaying/>
            <Box
                sx={{backgroundColor: "background.paper"}}
                marginBottom={3}
                borderRadius="12px"
                boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
            >
                <TabContext value={tabIndex}>
                    <TabList
                        onChange={handleChange}
                        sx={{
                            p: 0.5,
                            gap: 0.5,
                            [`& .${tabClasses.root}[aria-selected="true"]`]: {
                                boxShadow: 'sm',
                                borderRadius: 4,
                                bgcolor: 'background.default',
                            },
                            [`& .${tabClasses.root}:hover`]: {
                                boxShadow: 'sm',
                                borderRadius: 4,
                                bgcolor: 'background.default',
                            },
                        }}
                    >
                        <Tab
                            icon={<Image/>}
                            iconPosition={"start"}
                            label={"Images"}
                            value={0}
                            sx={{paddingy: 1, margin: 0.5, minHeight: '48px',}}
                        >
                        </Tab>
                        <Tab
                            icon={<Videocam/>}
                            iconPosition={"start"}
                            label={"Video"}
                            value={1}
                            sx={{paddingy: 1, margin: 0.5, minHeight: '48px',}}
                        >
                        </Tab>
                    </TabList>
                    <TabPanel value={0}><FileDropZone acceptedFileType={'image'}/></TabPanel>
                    <TabPanel value={1}><FileDropZone acceptedFileType={'video'}/></TabPanel>
                </TabContext></Box>
        </Box>
    )
}

export default ClientUI;