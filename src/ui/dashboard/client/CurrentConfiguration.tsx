//@ts-nocheck
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import {CardContent, InputLabel, Select, SelectChangeEvent, Slider} from "@mui/material";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import {useEffect, useState} from "react";
import {useWebSocketContext} from "../../../websocket/WebSocketContext.tsx";
import {slideShowProps} from "./ClientUI.tsx";
import FormControl from "@mui/material/FormControl";

const CurrentConfiguration = (config: slideShowProps) => {
    const {sendMessage} = useWebSocketContext();
    const [mediaType, setMediaType] = useState<string>('');

    //configuration handlers
    const [imageFit, setImageFit] = useState<string>('cover');
    const [transitionStyle, setTransitionStyle] = useState<string>('fade');
    const [transitionDuration, setTransitionDuration] = useState<number>(1);
    const [imageInterval, setImageInterval] = useState<number>(5);

    useEffect(() => {
        setMediaType(config.mediaType);
        setImageFit(config.objectFit || 'fill');
        setTransitionStyle(config.transitionStyle || 'slide');
        setTransitionDuration(config.transitionDuration || 1);
        setImageInterval(config.interval || 5);
    },[config, config.fileNames]);

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
            targetUser: config.clientId,
            mediaType: mediaType,
            transitionStyle: transitionStyle,
            transitionDuration: transitionDuration,
            imageFit: imageFit,
            imageInterval: imageInterval,
            fileNames: config.fileNames
        });

        sendMessage(jsonToSend);

    }


    return <Card sx={{minHeight: {xs: 320, md: 470, lg: 320}}}>
        <CardHeader
            title={<Typography
                fontSize={24}
                fontWeight={"bold"}>
                Content Configuration
            </Typography>}
            subheader={"Configure how the Images are displayed."}
        />
        <CardContent
            sx={{padding: 2,pt:1}}
        >
            <Box
                sx={{
                    display: {xs: "block", sm: "flex", md: "block", lg: "flex"},
                    alignItems: "center",
                    marginBottom: 2,
                    gap: 4
                }}
            >
                <FormControl sx={{width: "50%"}}>
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
                        <MenuItem value={"slide"}>slide</MenuItem>
                        <MenuItem value={"slicer"}>Slicer</MenuItem>
                        <MenuItem value={"shutters"}>Shutters</MenuItem>
                        <MenuItem value={"creative"}>Creative</MenuItem>
                    </Select>
                </FormControl>
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
                    gap: 4
                }}
            >
                <FormControl sx={{width: "50%"}}>
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
                </FormControl>
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
                    sx={{m:"4px!important"}}
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

}

export default CurrentConfiguration;