import Box from "@mui/material/Box";
import {useWebSocketContext} from "../../../websocket/WebSocketContext.tsx";

import Grid from "@mui/material/Grid2";
import PlaylistsCard from "./PlaylistsCard.tsx";

const PlaylistsUI = () => {
    // @ts-ignore
    const {playlists} = useWebSocketContext();

    return (
        <Box>
            <Grid
                container
                columnSpacing={{xs: 2, md: 3}}
                marginY={{xs: 0.75, sm: 1.5}}
                direction="row"
                sx={{flexGrow: 1}}
            >
                {
                    playlists.length !== 0 ? // @ts-ignore
                    playlists.map((playlist, index) => {
                    return<Grid key={index} size={6}> <PlaylistsCard playlist={playlist}/></Grid>
                })
                    : <Box width={"100%"} mt={8} textAlign={"center"} fontSize={26}>No playlists found</Box>
                }
            </Grid>
        </Box>
    )
}

export default PlaylistsUI;