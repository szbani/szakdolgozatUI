import {NavLink, Outlet, useParams} from "react-router-dom";
import Box from "@mui/material/Box";
import {Laptop} from "@mui/icons-material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Link from "@mui/material/Link";
import {useEffect, useState} from "react";

const linkStyle = {
    p: 1,
    display: "flex",
    alignItems: "center",
    fontSize: "inherit",
    fontWeight: 500,
    "&:hover": {
        boxShadow: 'sm',
        textDecoration: "none",
    }
};

const PlaylistsLayout = () => {
    const [playlist, setPlaylist] = useState<string>("");
    const params = useParams();

    useEffect(() => {
        if (params.playlistId) {
            setPlaylist(params.playlistId);
        } else {
            setPlaylist("");
        }
    }, [params.playlistId]);

    return (
        <Box>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Breadcrumbs
                    aria-label="breadcrumbs"
                    separator={<ChevronRightRoundedIcon fontSize="large"/>}
                    sx={{
                        pl: 0,
                        bgcolor: "background.paper",
                        borderRadius: 4,
                        padding: 0.5,
                    }}
                >
                    <Link
                        // color={display == "" ? "primary" : "neutral"}
                        component={NavLink}
                        to={'/playlists'}
                        sx={linkStyle}
                    >
                        <Laptop sx={{marginRight:"4px",fontSize:"inherit"}}/>
                        Playlists
                    </Link>
                    {playlist !== "" ?
                        <Link
                            // color={"secondary"}
                            component={NavLink}
                            sx={linkStyle}
                            to={'/playlists/' + params.clientId}>
                            {playlist}
                        </Link> : null
                    }
                </Breadcrumbs>
            </Box>
            <Box
                sx={{mt: 1.5}}
            >
                <Outlet/>
            </Box>
        </Box>
    )
}

export default PlaylistsLayout;