import {useWebSocketContext} from "../../../websocket/WebSocketContext.tsx";
import Card from "@mui/joy/Card";
import {CardActions, CardContent, Grid} from "@mui/joy";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";

const ClientsUI = () => {

    const {clients} = useWebSocketContext();

    // const clientsStateState = useState(clients);
    // console.log(clients);

    return (
        <Grid
            container
            spacing={{xs: 2, md: 3}}
            columns={{xs: 4, sm: 8, md: 12}}
            sx={{flexGrow: 1}}
        >
            {clients ? clientCards(clients) : <h1>No clients connected</h1>}
        </Grid>
    )
}

function clientCards(clients: string[]) {
    const listClients = clients.map((client,index) =>
        <Grid key={index}>
            <Card
                color="neutral"
                orientation="vertical"
                size="md"
                variant="outlined"
            >
                <Typography level="title-lg">{client}</Typography>
                <CardContent>Display currently not streaming any content.</CardContent>
                <CardActions><Button variant={"outlined"}>View</Button><Button>Disconnect</Button></CardActions>
            </Card>
        </Grid>
    );
    return listClients;
}

export default ClientsUI;