import {useEffect, useState} from "react";
import {loadPlaylistConfig} from "../components/ConfigLoader.ts";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import {CardActionArea} from "@mui/material";
import PlaylistsSwiper from "./PlaylistsSwiper.tsx";
import StyledNavLink from "../components/StyledNavLink.tsx";

interface PlaylistsProps {
    playlist: PlaylistProps;
}

interface PlaylistProps {
    Id: string;
    PlaylistName: string;
    PlaylistDescription: string;
}

const PlaylistCard = (props: PlaylistsProps) => {
    const playlist = props.playlist;

    const [playlistItems, setPlaylistItems] = useState<string[]>([]);

    const loadConfig = async (playlistID: string) => {
        try {
            // console.log('loadConfig:', playlistID);
            const config = await loadPlaylistConfig(playlistID);
            if (config !== null) {
                // console.log('config:', config);
                setPlaylistItems(config?.imagePaths);
            }
        } catch (e) {
            console.error('Error loading Config:', e);
        }
    }

    useEffect(() => {
        loadConfig(playlist.PlaylistName);
    }, []);

    return <Card sx={{my: 2}}>
        <StyledNavLink to={`/playlists/${playlist.PlaylistName}`}>
            <CardActionArea sx={{height: '450px'}}>
                <CardHeader
                    title={playlist.PlaylistName}
                    sx={{height:'15%'}}
                />
                <PlaylistsSwiper filePaths={playlistItems} name={playlist.PlaylistName}/>
            </CardActionArea>
        </StyledNavLink>
    </Card>;
}

export default PlaylistCard;