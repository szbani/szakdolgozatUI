import {NavLink, Outlet, useParams} from "react-router-dom";
import Box from "@mui/material/Box";
import {Laptop} from "@mui/icons-material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Link from "@mui/material/Link";
import {useEffect, useState} from "react";

const linkStyle = {
    p: 0.5,
    display: "flex",
    alignItems: "center",
    fontSize: "inherit",
    fontWeight: 500,
    "&:hover": {
        boxShadow: 'sm',
        bgcolor: 'white',
        borderRadius: 3,
        textDecoration: "none",
    }
};

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
        <Box>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Breadcrumbs
                    aria-label="breadcrumbs"
                    separator={<ChevronRightRoundedIcon fontSize="large"/>}
                    sx={{
                        pl: 0,
                        bgcolor: 'grey',
                        borderRadius: 4,
                        p: 1,
                    }}
                >
                    <Link
                        // color={display == "" ? "textcolor.secondary" : "neutral"}
                        component={NavLink}
                        to={'/displays'}
                        sx={linkStyle}
                    >
                        <Laptop sx={{marginRight:"4px",fontSize:"inherit"}}/>
                        Displays
                    </Link>
                    {display !== "" ?
                        <Link
                            // color={"textcolor.secondary"}
                            component={NavLink}
                            sx={linkStyle}
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
        </Box>
    )
}

export default ClientsLayout;