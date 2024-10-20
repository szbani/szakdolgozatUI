import {useWebSocketContext} from "../../../websocket/WebSocketContext.tsx";
import Card from "@mui/joy/Card";
import {CardActions, CardContent, Grid} from "@mui/joy";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import {NavLink} from "react-router-dom";

const ClientsUI = () => {
    // @ts-ignore
    const {clients} = useWebSocketContext();

    return (
        <Grid
            container
            spacing={{xs: 2, md: 3}}
            columns={{xs: 4, sm: 8, md: 12}}
            sx={{flexGrow: 1}}
        >
            {Array.isArray(clients) && clients.length === 0 ?
                <Typography level="title-lg" fontSize={25}>No Clients Connected</Typography> : clientCards(clients)}
        </Grid>
    )
}

const clientCards = (clients: string[]) => {
    const listClients = clients.map((client, index) =>
        <Grid key={index}>
            <Card
                color="neutral"
                orientation="vertical"
                size="md"
                variant="outlined"
            >
                <Typography level="title-lg">{client}</Typography>
                <CardContent>Display currently not streaming any content.</CardContent>
                <CardActions><NavLink to={`client/`+client}><Button>View</Button></NavLink><Button>Disconnect</Button></CardActions>
            </Card>
        </Grid>
    );
    return listClients;
}

export default ClientsUI;