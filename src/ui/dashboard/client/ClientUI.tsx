import Box from "@mui/material/Box";
import {loadShowCaseConfig} from "../components/ConfigLoader.ts";
import {useParams} from "react-router-dom";
import {useWebSocketContext} from "../../../websocket/WebSocketContext.tsx";
import {useEffect, useState} from "react";
import Grid from "@mui/material/Grid2";
import CurrentConfiguration from "./CurrentConfiguration.tsx";
import CurrentPlaying from "./CurrentPlaying.tsx";
import UploadModal from "./UploadModal.tsx";
import ChangeTime from "./ChangeTime.tsx";

type ObjectFit = "contain" | "cover" | "fill" | "none" | "scale-down";

export interface slideShowProps {
    mediaType: string,
    clientId: string,
    fileNames: string[],
    transitionStyle?: string,
    transitionDuration?: number,
    interval?: number,
    objectFit?: ObjectFit,
    changeTime: string,
}

export interface changeTimesData {
    start: string
    end: string
}

// @ts-ignore
const CurrentActions = ({slideShowConfig, setChangeTime, changeTimes}) => {
    return (
        <Box marginBottom={4}>
            <Grid container spacing={4}>
                <Grid size={{xs: 12, sm: 12, md: 6, lg: 6.5, xl: 7}}>
                    <CurrentPlaying {...slideShowConfig}></CurrentPlaying>

                </Grid>
                <Grid size={{xs: 12, sm: 12, md: 6, lg: 5.5, xl: 5}}>
                    <CurrentConfiguration {...slideShowConfig}></CurrentConfiguration>
                    <ChangeTime clientId={slideShowConfig.clientId} selectedTime={slideShowConfig.changeTime} setTime={setChangeTime}
                                times={changeTimes}></ChangeTime>
                    <UploadModal {...slideShowConfig}></UploadModal>
                </Grid>
            </Grid>
        </Box>
    )
}

const ClientUI = () => {

    const [changeTime, setChangeTime] = useState<string>("default");
    const [changeTimes, setChangeTimes] = useState<changeTimesData[]>([]);
    const [firstLoad, setFirstLoad] = useState<boolean>(true);

    // @ts-ignore
    const {fileNames, setNewConfig, newConfig} = useWebSocketContext();
    const {clientId} = useParams() || "";
    const [slideShowConfig, setSlideShowConfig] = useState<slideShowProps>({
        mediaType: "image",
        clientId: "",
        transitionStyle: "slide",
        transitionDuration: 1,
        interval: 5,
        objectFit: "fill",
        fileNames: [],
        changeTime: changeTime,
    });

    useEffect(() => {
        if (newConfig) setNewConfig(false);
        // @ts-ignore
        loadConfig(clientId);
    }, [fileNames, newConfig]);

    let now = new Date();

    useEffect(() => {
        // @ts-ignore
        loadConfig(clientId);
    }, [changeTime]);


    const loadConfig = async (userId: string) => {
        try {
            now = new Date();
            console.log('loadConfig:', userId);
            const config = await loadShowCaseConfig(userId);
            console.log('config:', config);
            if (config !== null && firstLoad) {
                let fileNamesTime = "default";
                if (config.changeTimes.length > 0) {
                    const timesArray: changeTimesData[] = [];
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
                                            // nextTime = nextPlanedChangeTime;
                                            recurzive(currentI);
                                        }
                                    }
                                }
                            }
                        }
                        recurzive(i)
                        if (config.changeTimes[i] !== "default") {
                            timesArray.push({
                                start: config.changeTimes[i],
                                //@ts-ignore
                                end: config?.[config.changeTimes[i]].endTime
                            });
                        }
                    }
                    setChangeTimes(timesArray);
                    setChangeTime(fileNamesTime);
                }
                // @ts-ignore
                if (config?.[fileNamesTime].mediaType === "image") {
                    setSlideShowConfig({
                        // @ts-ignore
                        mediaType: config?.[fileNamesTime].mediaType,
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
                } else if (config?.[fileNamesTime].mediaType === "video") {
                    setSlideShowConfig({
                        // @ts-ignore
                        mediaType: config?.[fileNamesTime].mediaType,
                        clientId: userId,
                        // @ts-ignore
                        fileNames: config?.[fileNamesTime].paths,
                        changeTime: fileNamesTime,
                    });
                }
            } else if (config !== null) {
                if (config.changeTimes.includes(changeTime)) {
                    // @ts-ignore
                    if (config?.[changeTime].mediaType === "image") {
                        setSlideShowConfig({
                            // @ts-ignore
                            mediaType: config?.[changeTime].mediaType,
                            clientId: userId,
                            // @ts-ignore
                            fileNames: config?.[changeTime].paths,
                            transitionStyle: config?.transitionStyle,
                            transitionDuration: config?.transitionDuration,
                            interval: config?.imageInterval,
                            // @ts-ignore
                            objectFit: config?.imageFit,
                            changeTime: changeTime,
                        });
                        // @ts-ignore
                    } else if (config?.[changeTime].mediaType === "video") {
                        setSlideShowConfig({
                            // @ts-ignore
                            mediaType: config?.[changeTime].mediaType,
                            clientId: userId,
                            // @ts-ignore
                            fileNames: config?.[changeTime].paths,
                            changeTime: changeTime,
                        });
                    }
                }
            }
            setFirstLoad(false);
        } catch (error) {
            console.error('Error loading config:', error);
        }
    }

    return (
        <Box>
            <CurrentActions
                slideShowConfig={slideShowConfig}
                setChangeTime={setChangeTime}
                changeTimes={changeTimes}
            />
        </Box>
    )
}

export default ClientUI;