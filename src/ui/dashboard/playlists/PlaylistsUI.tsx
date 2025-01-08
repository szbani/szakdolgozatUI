import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import {CardActionArea, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import {useEffect, useState} from "react";
import {useWebSocketContext} from "../../../websocket/WebSocketContext.tsx";
import {Save} from "@mui/icons-material";
import {Swiper, SwiperSlide} from "swiper/react";

import 'swiper/css';
import 'swiper/css/zoom';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import {Autoplay, EffectCoverflow, Pagination, Zoom, Navigation, A11y} from 'swiper/modules';
import MySwiper from "./PlaylistsSwiper.tsx";

interface PlaylistsProps {
    playlist: PlaylistProps;
}

interface PlaylistProps {
    id: string;
    name: string;
    description: string;
    items: string[];
}

const PlaylistsUI = () => {
    const {sendMessage} = useWebSocketContext();

    const [playlists, setPlaylists] = useState<PlaylistsProps[]>([]);


    useEffect(() => {
        const temp: PlaylistsProps[] = [
            {
                id: "1",
                name: "Playlist 1",
                description: "This is a playlist",
                items: ["item1", "item2", "item3"]
            },
            {
                id: "2",
                name: "Playlist 2",
                description: "This is a playlist",
                items: ["item1", "item2", "item3"]
            }
        ]
        setPlaylists(temp);
    }, []);




    const CardHandler = (props: PlaylistsProps) => {
        const playlist = props.playlist;
        console.log(playlist.items);

        return <Card sx={{my: 2}}>
            <CardHeader
                title={<CardTitle id={playlist.id} name={playlist.name}/>}
            ></CardHeader>
            <CardActionArea sx={{p: 2, height:'400px'}}>
                <MySwiper/>
            </CardActionArea>
        </Card>;
    }

    const CardTitle = (props) => {
        const {id, name} = props;
        const [edit, setEdit] = useState(false);
        if (edit) {
            return <Box fontSize={'inherit'} display={'inline-flex'}>
                <TextField sx={{border: 'none'}} label={"Playlist Name"} value={name}></TextField>
                <IconButton size={'small'} onClick={() => setEdit(false)}><Save/></IconButton>
            </Box>;
        }

        return <Box fontSize={'inherit'} display={"inline-flex"}>
            <Typography fontSize={'inherit'}>{name}</Typography>
            <IconButton size={'small'} onClick={() => setEdit(true)}><EditIcon/></IconButton>
        </Box>;
    }

    return (
        <Box>
            <TextField label={"Search"}></TextField>
            <Button variant={"contained"}>Add Playlist</Button>
            {playlists.map((playlist, index) => {
                return <CardHandler playlist={playlist}/>
            })}
        </Box>
    )
}

export default PlaylistsUI;