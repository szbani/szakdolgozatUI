//@ts-nocheck
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import {CardContent} from "@mui/material";
import {Key, useEffect, useRef} from "react";
import Card from "@mui/material/Card";
import {slideShowProps} from "./ClientUI.tsx";
import ShowCaseSwiper from "../../showcase/ShowCaseSwiper.tsx";


const CurrentPlaying = ( slideShowConfig?:slideShowProps) => {

    const videoRef = useRef<HTMLVideoElement>(null);


        useEffect(() => {
            if (videoRef.current && slideShowConfig.mediaType == 'video') {
                videoRef.current.load();
            }
        }, [slideShowConfig.mediaType, slideShowConfig.fileNames]);


    return <Card sx={{minHeight: {xs: 320, md: 470, lg: 400}}}>
        <CardHeader
            title={<Typography
                fontSize={24}
                fontWeight={"bold"}>
                Currently Playing {slideShowConfig.mediaType}
            </Typography>}
            sx={{padding: 2, paddingBottom: 0}}
        />
        <CardContent sx={{height: {xs: 320, md: 470, lg: 380}}}>
            {
                slideShowConfig?.fileNames && slideShowConfig?.fileNames.length == 0 ?
                    <p>No content currently shown.</p> :
                    slideShowConfig.mediaType == 'image' ?
                        <ShowCaseSwiper {...slideShowConfig} fileNames={slideShowConfig?.fileNames}/>
                        : slideShowConfig.mediaType == 'video' ? slideShowConfig?.fileNames.map((fileName: string, index: Key) => {
                            return (
                                <video key={index} ref={videoRef} muted controls autoPlay loop
                                       style={{objectFit: "contain", width: "100%", height:"100%"}}>
                                    <source src={`/displays/${slideShowConfig.clientId}/${slideShowConfig?.changeTime}/${fileName}`} type="video/mp4"/>
                                </video>
                            )
                        }) : <p>Unknown media type</p>
            }
        </CardContent>
    </Card>

}

export default CurrentPlaying;