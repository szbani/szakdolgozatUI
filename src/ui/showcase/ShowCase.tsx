import {ClientWebSocket} from "../../websocket/ClientWebSocketBase.ts";
import Box from "@mui/joy/Box";
import Carousel from "react-material-ui-carousel";
import {Paper} from "@mui/material";


export const SlideShow = () => {
    const items = [
        {
            name: "Slide 3",
            description: "Slide 3 Description",
            backgroundColor: "#60cd17"

        },
        {
            name: "Slide 4",
            description: "Slide 4 Description",
            backgroundColor: "#17b2cd"

        },
        {
            name: "Slide 5",
            description: "Slide 5 Description",
            backgroundColor: "#cd1717"
        },
    ]

    return (
        <Carousel indicators={false} interval={5000} >
            {
                items.map((item, i) => <Item key={i} item={item}/>)
            }
        </Carousel>
        )
}

const Item = (props) => {
    return (
        <Paper sx={{height:"100vh", borderRadius: '0px', backgroundColor: props.item.backgroundColor}} >
            {/*<h2 >{props.item.name}</h2>*/}
            {/*<p>{props.item.description}</p>*/}
        </Paper>
    )
}

export const VideoPlayer = () => {
    return (
        <video width="100%" height="100%" loop autoPlay>
            <source src="/src/ui/showcase/movie.mp4" type="video/mp4"/>
            Your browser does not support the video tag.
        </video>
    )
}

const ShowCase = () => {
    const socket = ClientWebSocket();

    return (
        <Box sx={{cursor: "none", width: '100%', height: '100%'}}>
            {/*<VideoPlayer/>*/}
            <SlideShow/>
        </Box>
    )
}

export default ShowCase;