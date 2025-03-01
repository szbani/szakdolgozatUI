//@ts-nocheck
import Box from "@mui/material/Box";
import {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import {useWebSocketContext} from "../../../websocket/WebSocketContext.tsx";
import {useMediaQuery} from "@mui/material";

const BoxItem = ({clientId,item,changeTime, active, onClick}) => {

    return (
        <Grid
            border={active ? 2 : 1}
            borderColor={active ? "#05e195" : "black"}
            size={4}
            height={125}
            textAlign={"center"}
            sx={{backgroundColor: active ? "wheat" : "lightgray", cursor: "pointer"}}
            onClick={onClick}
            display={"inherit"}
        >
            {
                item.includes(".mp4") ?
                <video src={`/displays/${clientId}/${changeTime}/${item}`} height={"100%"} width={"100%"} controls/> :
                <img src={`/displays/${clientId}/${changeTime}/${item}`} height={"100%"} width={"100%"}/>
            }
        </Grid>
    )
}


const MediaBox = ({clientId, active, changeTime, setActive, items, setItems, del = 0}) => {
    // @ts-ignore
    const {sendMessage} = useWebSocketContext();

    let changeTimeDir = changeTime;
    if (changeTimeDir != "default") {
        changeTimeDir = changeTime.replace(":", "_");
    }

    const HandleDelete = () => {
        if (items.length != 0) {

            const jsonToSend = JSON.stringify({
                "type": "deleteMedia",
                "targetUser": clientId,
                "changeTime": changeTime,
                "fileNames": items
            });
            // console.log(jsonToSend);
            setItems([]);
            sendMessage(jsonToSend);
        }
    }

    const setItemActive = (index) => {
        if (active.includes(index)) {
            setActive(active.filter((item) => item !== index));
        } else {
            setActive([...active, index]);
        }
    }


    const DeleteTitle = () => {
        return (
            <Box display={"flex"}>
                <Typography fontSize={"1.5rem"}>Files To Delete</Typography>
                <Button sx={{marginLeft:"auto"}} onClick={HandleDelete}>Delete Files</Button>
            </Box>
        )
    }

    return (
        <Card sx={{width:{xs:"100%",md:"50%"},height: {xs:"35vh",md:"60vh"}}}>
            <CardHeader title={del == 0 ? "Files To Remain" : DeleteTitle()} sx={{height: "15%"}}></CardHeader>
            <CardContent sx={{p:0,m:2,height:"80%", overflow:"scroll"}}>
                <Grid container spacing={1} overflow={"scroll"}>
                    {items.map((item, index) => {
                        return (
                            <BoxItem changeTime={changeTimeDir} clientId={clientId} key={index} item={item} onClick={() => setItemActive(index)}
                                     active={active.includes(index)}></BoxItem>
                        )
                    })}
                </Grid>
            </CardContent>
        </Card>
    )
}

const DeleteMedia = ({fileNames, changeTime, clientId}) => {
    const [currentItems, setCurrentItems] = useState(fileNames);
    const [deleteItems, setDeleteItems] = useState([]);
    const [currentActive, setCurrentActive] = useState<number[]>([]);
    const [deleteActive, setDeleteActive] = useState<number[]>([]);

    const isXs = useMediaQuery(theme => theme.breakpoints.down("md"));


    useEffect(() => {
        if (deleteActive.length > 0 && currentActive.length > 0) {
            setDeleteActive([]);
        }
    }, [currentActive]);

    useEffect(() => {
        if (currentActive.length > 0 && deleteActive.length > 0) {
            setCurrentActive([]);
        }
    }, [deleteActive]);

    useEffect(() => {
        setCurrentItems(currentItems.sort());
        setDeleteItems(deleteItems.sort());
    }, [currentItems != currentItems.sort(), deleteItems != deleteItems.sort()]);


    const MoveItems = (destination, all) => {
        if (destination == "current") {
            if (all) {
                setCurrentItems([...currentItems, ...deleteItems]);
                setDeleteItems([]);
                // setRightItems(currentItems.sort());
            } else {
                setCurrentItems([...currentItems, ...deleteItems.filter((item, index) => deleteActive.includes(index))]);
                setDeleteItems(deleteItems.filter((item, index) => !deleteActive.includes(index)));
                // setRightItems(currentItems.sort());
            }
        } else {
            if (all) {
                setDeleteItems([...deleteItems, ...currentItems]);
                setCurrentItems([]);
                // setLeftItems(deleteItems.sort());
            } else {
                setDeleteItems([...deleteItems, ...currentItems.filter((item, index) => currentActive.includes(index))]);
                setCurrentItems(currentItems.filter((item, index) => !currentActive.includes(index)));
                // setLeftItems(deleteItems.sort());
            }
        }
        setDeleteActive([]);
        setCurrentActive([]);
    }

    return (
        <Box sx={{display: "flex", gap: 1, flexDirection: {xs:"column", md:"row"}, justifyContent: "center", alignItems: "center"}}>
            <MediaBox clientId={clientId} changeTime={changeTime} key={"current"} active={currentActive} setItems={setCurrentItems} setActive={setCurrentActive}
                      items={currentItems}></MediaBox>
            <Grid container height={"50%"} gap={2} spacing={0} sx={{justifyContent: "center", alignItems: "center"}} width={{xs:"100%",md:"9%",lg:"7%", xl:"5%"}}>
                <Grid size={{xs:2, md:12}}>
                    <Button fullWidth onClick={() => MoveItems("current", true)}>{isXs ? "∧∧" : "<<"}</Button>
                </Grid>
                <Grid size={{xs:2, md:12}}>
                    <Button fullWidth onClick={() => MoveItems("current", false)}>{isXs ? "∧" : "<"}</Button>
                </Grid>
                <Grid size={{xs:2, md:12}}>
                    <Button fullWidth onClick={() => MoveItems("delete", false)}>{isXs ? "∨" : ">"}</Button>
                </Grid>
                <Grid size={{xs:2, md:12}}>
                    <Button fullWidth onClick={() => MoveItems("delete", true)}>{isXs ? "∨∨" : ">>"}</Button>
                </Grid>

            </Grid>
            <MediaBox clientId={clientId} changeTime={changeTime} key={"delete"} del={1} active={deleteActive} setItems={setDeleteItems} setActive={setDeleteActive}
                      items={deleteItems}></MediaBox>
        </Box>
    )
}
export default DeleteMedia;