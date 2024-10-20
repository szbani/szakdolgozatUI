//@ts-nocheck
import {NavLink, Outlet, useParams} from "react-router-dom";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
import {ArrowBackRounded} from "@mui/icons-material";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Link from "@mui/joy/Link";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import {useEffect, useState} from "react";
import IconButton from "@mui/joy/IconButton";

const clientsLayout = () => {
    const [display, setDisplay] = useState<string>("");
    const params = useParams();

    useEffect(() => {
        if (params.clientId) {
            setDisplay(params.clientId);
        } else {
            setDisplay("");
        }
    }, [params.clientId]);

    return (
        <div>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Breadcrumbs
                    size="sm"
                    aria-label="breadcrumbs"
                    separator={<ChevronRightRoundedIcon fontSize="sm"/>}
                    sx={{pl: 0}}
                >
                    <Link
                        underline="hover"
                        color="neutral"
                        sx={{fontSize: 12, fontWeight: 500}}
                        component={NavLink}
                        to={'/'}
                    >
                        <HomeRoundedIcon/>
                        Dashboard
                    </Link>
                    <Link
                        underline="hover"
                        color="neutral"
                        sx={{fontWeight: 500, fontSize: 12}}
                        component={NavLink}
                        to={'/displays'}
                    >
                        Displays
                    </Link>
                    {display !== "" ?
                        <Typography color="primary" sx={{fontWeight: 500, fontSize: 12}} component={NavLink}
                                    to={'/displays/client/' + params.clientId}>
                            {display}
                        </Typography> : null
                    }
                </Breadcrumbs>
            </Box>
            {display == "" ?
                <Box
                    sx={{
                        display: 'flex',
                        mb: 1,
                        gap: 1,
                        flexDirection: {xs: 'column', sm: 'row'},
                        alignItems: {xs: 'start', sm: 'center'},
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography level="h2" component="h1">
                        Displays Available
                    </Typography>
                    <Button
                        color="primary"
                        size="sm"
                    >
                        Invite Display
                    </Button>
                </Box> : <Box
                    sx={{
                        display: 'flex',
                        mb: 1,
                        gap: 1,
                        flexDirection: {xs: 'column', sm: 'row'},
                        alignItems: {xs: 'start', sm: 'center'},
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                    }}
                >

                    <Typography level="h2" component="h1">
                        <NavLink to={'/displays'}>
                            <IconButton
                                color="primary"
                                size="md"
                            >
                                <ArrowBackRounded/>
                            </IconButton>
                        </NavLink>
                        Looking at Display: {display}
                    </Typography>
                </Box>
            }
            <Box
                sx={{mt: 5}}
            >
                <Outlet/>
            </Box>
        </div>
    )
}

export default clientsLayout;