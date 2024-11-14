import {useWebSocketContext} from "../../../websocket/WebSocketContext.tsx";
import Card from "@mui/joy/Card";
import {CardContent} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import {
    AddToQueue,
    Circle,
    DeleteForever,
    Edit,
    MoreVert,
    PowerOff,
    PowerSettingsNew, RestartAlt
} from "@mui/icons-material";
import MenuButton from "@mui/joy/MenuButton";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListDivider from "@mui/joy/ListDivider";
import {NavLink} from "react-router-dom";
import Grid from "@mui/material/Grid2";

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
                    <Typography level="title-lg" fontSize={16}>
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
                    <Typography level="title-lg" fontSize={16}>No Clients
                        Connected</Typography> : ClientCards(unRegisteredDisplays)}
            </Grid>
        </>
    )
}

const ClientCards = (clients: IClient[]) => {
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

    const ListClients = clients.map((client, index) =>
            <Grid size={{xs:6,sm:4,md:4,lg:3,xl:2.2}} key={index}>
                <Card
                    color="neutral"
                    orientation="vertical"
                    size="md"
                    variant="outlined"
                >
                    <CardContent orientation="horizontal">

                        <Box width={"70%"} >
                            <Typography level="title-lg">{client.NickName ?? "Unregistered"}</Typography>
                            {client.ClientName ?
                                <Typography fontSize="sm" whiteSpace={'normal'} overflow={'auto'}
                                            sx={{lineBreak: "anywhere"}} height={"60px"}>
                                    KioskName:<br/> {client.ClientName}</Typography> : null}
                        </Box>

                        <Dropdown>
                            <MenuButton sx={{border: "none", padding: "12px", height: "min-content"}}>
                                <MoreVert/>
                            </MenuButton>

                            {
                                client.Status ?
                                    <Menu sx={{paddingBottom: "0px"}}>
                                        <MenuItem
                                            onClick={() => console.log("todo")}><ListItemDecorator><Edit/></ListItemDecorator>Edit</MenuItem>
                                        <MenuItem
                                            onClick={() => WakeUpDisplay(client.NickName)}><ListItemDecorator><PowerSettingsNew/></ListItemDecorator> Wake
                                            Up</MenuItem>
                                        <ListDivider sx={{marginBottom: "0px"}}/>
                                        <MenuItem sx={{paddingBottom: "12px", marginTop: "0px"}} variant="soft"
                                                  color="danger"
                                                  onClick={() => unRegisterDisplay(client.NickName)}>
                                            <ListItemDecorator sx={{color: "inherit"}}>
                                                <DeleteForever/>
                                            </ListItemDecorator>
                                            UnRegister
                                        </MenuItem>
                                    </Menu> :
                                    client.NickName ?
                                        <Menu sx={{paddingBottom: "0px"}}>
                                            <MenuItem
                                                onClick={() => console.log("todo")}><ListItemDecorator><Edit/></ListItemDecorator>Edit</MenuItem>
                                            <ListDivider sx={{marginBottom: "0px"}}/>
                                            <MenuItem sx={{paddingBottom: "12px", marginTop: "0px"}} variant="soft"
                                                      color="danger"
                                                      onClick={() => RebootDisplay(client.ClientName)}>
                                                <ListItemDecorator sx={{color: "inherit"}}>
                                                    <RestartAlt/>
                                                </ListItemDecorator>
                                                Reboot
                                            </MenuItem>
                                            <MenuItem sx={{paddingBottom: "12px", marginTop: "0px"}} variant="soft"
                                                      color="danger"
                                                      onClick={() => DisconnectDisplay(client.ClientName)}>
                                                <ListItemDecorator sx={{color: "inherit"}}>
                                                    <PowerOff/>
                                                </ListItemDecorator>
                                                ShutDown
                                            </MenuItem>
                                        </Menu> :
                                        <Menu sx={{padding: "0px"}}>
                                            <MenuItem
                                                onClick={() => RegisterDisplay(client.ClientName)}
                                                sx={{paddingY: "9px"}}><ListItemDecorator><AddToQueue/></ListItemDecorator>Register</MenuItem>
                                            <ListDivider sx={{margin: "0px"}}/>
                                            <MenuItem sx={{paddingBottom: "12px", marginTop: "0px"}} variant="soft"
                                                      color="danger"
                                                      onClick={() => console.log("todo disconnect")}>
                                                <ListItemDecorator sx={{color: "inherit"}}>
                                                    <PowerOff/>
                                                </ListItemDecorator>
                                                Disconnect
                                            </MenuItem>
                                        </Menu>
                            }
                        </Dropdown>
                    </CardContent>

                    <Box>
                        <CardContent>
                            {client.Status ?    // @ts-ignore
                                <Typography fontSize="md"><Circle color="danger" fontSize="md"/>Offline</Typography> :
                                <Typography component={NavLink}
                                            to={"client/" + client.ClientName}
                                            color="neutral"
                                            sx={{fontWeight: 'bold', textDecoration: 'none'}}
                                >
                                    <Typography fontSize="md">
                                        {/*// @ts-ignore*/}
                                        <Circle color="success" fontSize="md"/>Online<br/>
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