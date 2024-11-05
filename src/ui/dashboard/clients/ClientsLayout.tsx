//@ts-nocheck
import {NavLink, Outlet, useParams} from "react-router-dom";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import {ArrowBackRounded, Laptop} from "@mui/icons-material";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Link from "@mui/joy/Link";
import {useEffect, useState} from "react";
import IconButton from "@mui/joy/IconButton";

const ClientsLayout = () => {
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
                {display !== "" ? <NavLink to={'/displays'}>
                    <IconButton
                        color="neutral"
                        size="md"
                    >
                        <ArrowBackRounded/>
                    </IconButton>
                </NavLink> : null}
                <Breadcrumbs
                    size="lg"
                    aria-label="breadcrumbs"
                    separator={<ChevronRightRoundedIcon fontSize="large"/>}
                    sx={{pl: 0,fontSize: "22.5px"}}
                >
                    <Link
                        underline="hover"
                        color={display == "" ? "" : ""}
                        sx={{fontWeight: 500}}
                        component={NavLink}
                        to={'/displays'}
                        fontSize={"inherit"}
                    >
                        <Laptop sx={{marginRight:"4px",fontSize:"inherit"}}/>
                        Displays
                    </Link>
                    {display !== "" ?
                        <Link color="primary" sx={{fontWeight: 500}} component={NavLink} fontSize={"inherit"}
                                    to={'/displays/client/' + params.clientId}>
                            {display}
                        </Link> : null
                    }
                </Breadcrumbs>
            </Box>
            <Box
                sx={{mt: 1.5}}
            >
                <Outlet/>
            </Box>
        </div>
    )
}

export default ClientsLayout;