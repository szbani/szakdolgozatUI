import {useWebSocketContext} from "../../../websocket/WebSocketContext.tsx";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
    AddToQueue,
    Circle,
    DeleteForever,
    Edit,
    MoreVert,
    PowerOff,
    PowerSettingsNew, RestartAlt
} from "@mui/icons-material";
import Menu from "@mui/material/Menu";
import Divider from "@mui/material/Divider";
import {NavLink} from "react-router-dom";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import {useState} from "react";
import CardHeader from "@mui/material/CardHeader";

interface IClient {
    NickName: string;
    ClientName: string;
    Status: boolean;
}

const ClientsUI = () => {
    // @ts-ignore
    const {registeredDisplays, unRegisteredDisplays} = useWebSocketContext() || [];


    return (<>
            <Typography fontSize="20px" fontWeight="bold">Registered Displays</Typography>

            <Grid
                container
                spacing={{xs: 2, md: 3}}
                marginY={{xs: 0.75, sm: 1.5}}
                direction="row"
                sx={{flexGrow: 1}}
            >
                {registeredDisplays.length === 0 ?
                    <Typography fontSize={16}>
                        No Registered Displays
                    </Typography> : ClientCards(registeredDisplays)}
            </Grid>
            <Typography fontSize="20px" fontWeight="bold">UnRegistered Displays</Typography>
            <Grid
                container
                spacing={{xs: 2, md: 3}}
                columns={{xs: 4, sm: 8, md: 12}}
                sx={{flexGrow: 1}}
                marginTop={{xs: 0.75, sm: 1.5}}
            >
                {unRegisteredDisplays.length === 0 ?
                    <Typography fontSize={16}>No Clients
                        Connected</Typography> : ClientCards(unRegisteredDisplays)}
            </Grid>
        </>
    )
}

const Client = ({client, index}) => {

    // @ts-ignore
    const {sendMessage} = useWebSocketContext();

    const DisconnectDisplay = (clientId: string) => {
        const jsonToSend = JSON.stringify({
            type: 'Disconnect',
            targetUser: clientId,
        });
        sendMessage(jsonToSend);
    }

    const RebootDisplay = (clientId: string) => {
        const jsonToSend = JSON.stringify({
            type: 'RebootDisplay',
            targetUser: clientId,
        });
        sendMessage(jsonToSend);
    }

    const WakeUpDisplay = (NickName: string) => {
        const jsonToSend = JSON.stringify({
            type: 'StartDisplay',
            targetUser: NickName,
        });
        sendMessage(jsonToSend);
    }

    const unRegisterDisplay = (clientId: string) => {
        const jsonToSend = JSON.stringify({
            type: 'RemoveRegisteredDisplay',
            targetUser: clientId,
        });
        sendMessage(jsonToSend);
    }

    const RegisterDisplay = (clientId: string) => {
        const jsonToSend = JSON.stringify({
            type: 'RegisterDisplay',
            targetUser: clientId,
            displayDescription: "Kiosk",
        });
        sendMessage(jsonToSend);
    }

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <Button
                id={`client-${index}-button`}
                sx={{border: "none", padding: "12px", height: "min-content"}}
                aria-controls={open ? `client-${index}-menu` : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}>
                <MoreVert/>
            </Button>
            {
                client.Status ?
                    <Menu
                        id={`client-${index}-menu`}
                        aria-labelledby={`client-${index}-button`}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        // sx={{paddingBottom: "0px"}}
                    >
                        <MenuItem
                            onClick={() => console.log("todo")}
                        >
                            <Edit/>Edit
                        </MenuItem>
                        <MenuItem
                            onClick={() => WakeUpDisplay(client.NickName)}
                        >
                            <PowerSettingsNew/> Wake Up
                        </MenuItem>
                        <Divider sx={{marginBottom: "0px"}}/>
                        <MenuItem
                            sx={{paddingBottom: "12px", marginTop: "0px"}}
                            color="danger"
                            onClick={() => unRegisterDisplay(client.NickName)}
                        >
                            <DeleteForever/>UnRegister
                        </MenuItem>
                    </Menu> :
                    client.NickName ?
                        <Menu
                            id={`client-${index}-menu`}
                            aria-labelledby={`client-${index}-button`}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            // sx={{paddingBottom: "0px"}}
                        >
                            <MenuItem
                                onClick={() => console.log("todo")}><Edit/>Edit</MenuItem>
                            <MenuItem
                                sx={{paddingBottom: "12px", marginTop: "0px"}}
                                color="danger"
                                onClick={() => RebootDisplay(client.ClientName)}
                            >
                                <RestartAlt/>Reboot
                            </MenuItem>
                            <MenuItem
                                sx={{paddingBottom: "12px", marginTop: "0px"}}
                                color="danger"
                                onClick={() => DisconnectDisplay(client.ClientName)}
                            >
                                <PowerOff/>ShutDown
                            </MenuItem>
                        </Menu> :
                        <Menu
                            id={`client-${index}-menu`}
                            aria-labelledby={`client-${index}-button`}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            // sx={{padding: "0px"}}
                        >
                            <MenuItem
                                onClick={() => RegisterDisplay(client.ClientName)}
                                sx={{paddingY: "9px"}}
                            >
                                <AddToQueue/>Register
                            </MenuItem>
                            <Divider sx={{margin: "0px"}}/>
                            <MenuItem
                                sx={{paddingBottom: "12px", marginTop: "0px"}}
                                color="danger"
                                onClick={() => console.log("todo disconnect")}
                            >
                                <PowerOff/>Disconnect
                            </MenuItem>
                        </Menu>

            }</>);
};


const ClientCards = (clients: IClient[]) => {
    const ListClients = clients.map((client, index) =>
            <Grid size={{xs: 6, sm: 4, md: 4, lg: 3, xl: 2.2}} key={index}>
                <Card
                    variant="outlined"
                >
                    <CardHeader
                        action={
                            <Client client={client} index={index}/>
                        }
                        title={client.NickName ?? "Unregistered"}
                        subheader={`KioskName: ${client.ClientName}`}
                        sx={{lineBreak: "anywhere", overflow: 'auto', whiteSpace: 'normal'}}
                    >
                    </CardHeader>

                    <Box>
                        <CardContent>
                            {client.Status ?
                                <Typography>
                                    <Circle/>Offline
                                </Typography> :
                                <Typography component={NavLink}
                                            to={"client/" + client.ClientName}
                                            sx={{fontWeight: 'bold', textDecoration: 'none'}}
                                >
                                    <Typography fontSize="md">
                                        <Circle color="success"/>Online<br/>
                                    </Typography>
                                    Click To Manage
                                </Typography>
                            }
                        </CardContent>
                    </Box>
                </Card>
            </Grid>
        )
    ;
    return ListClients;
}

export default ClientsUI;