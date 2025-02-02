//@ts-nocheck
import Box from "@mui/material/Box";
import CurrentPlaying from "../client/CurrentPlaying.tsx";
import BaseUploadMenuModal from "../FileUploadMenu/BaseUploadMenuModal.tsx";
import {loadPlaylistConfig} from "../../showcase/ShowCaseConfig.ts";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";


const PlaylistUI = () => {
    const {clientId} = useParams();
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
        if (clientId !== undefined)
            loadConfig(clientId);
    }, []);


    return (
        <Box mt={2}>
            <CurrentPlaying objectFit={'contain'} mediaType={'image'} interval={5} fileNames={playlistItems}
                            clientId={clientId} transitionStyle={'slide'} transitionDuration={5}/>
            <BaseUploadMenuModal/>
            <h1>Playlist</h1>
        </Box>
    );
}

export default PlaylistUI;