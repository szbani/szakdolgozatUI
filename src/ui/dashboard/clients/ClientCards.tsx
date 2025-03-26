import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {Circle} from "@mui/icons-material";
import {NavLink} from "react-router-dom";
import {IClient} from "./ClientsUI.tsx";
import {Client} from "./Client.tsx";

interface EditDialogHandler {
    setEditDialogData: (data: IClient) => void;
    setOpenEditDialog: (open: boolean) => void;
}

export const ClientCards = (clients: IClient[], editDialogHandler: EditDialogHandler) => {
    // console.log(clients);
    const ListClients = clients.map((client, index) =>
            <Grid size={{xs: 6, sm: 4, md: 6, lg: 3.5, xl: 3.25}} key={index}>
                <Card
                    variant="outlined"
                    sx={{backgroundColor: 'background.cards'}}
                >
                    <CardHeader
                        action={
                            <Client client={client} index={index} EditDialogHandler={editDialogHandler}/>
                        }
                        title={client.NickName ?? "Unregistered"}
                        subheader={`KioskName: ${client.KioskName}`}
                        sx={{lineBreak: "anywhere", overflow: 'auto', whiteSpace: 'normal', paddingBottom:1}}
                    >
                    </CardHeader>
                    <CardContent sx={{paddingY:0, overflow:"auto", whiteSpace: 'normal',lineBreak:'normal'}}>
                        <Typography variant="body2" color="text.secondary">
                            {client.Description}
                        </Typography>
                    </CardContent>
                    <Box component={client.KioskName != null ? NavLink : Box} to={"client/" + client.KioskName}>
                        <CardContent>
                            {client.Status ?
                                <Typography>
                                    <Circle color="error"/>Offline
                                </Typography> :
                                <Typography
                                    color={"primary"}
                                    sx={{
                                        fontWeight: 'bold',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            textDecoration: 'underline',
                                            color: 'primary.dark'
                                        }
                                    }}
                                >
                                    <Circle color="success"/>Online<br/>
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