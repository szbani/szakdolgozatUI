import {useWebSocketContext} from "../../../websocket/WebSocketContext.tsx";
import {useState} from "react";

const ClientsUI = () => {

    const {clients}= useWebSocketContext();

    // const clientsStateState = useState(clients);
    // console.log(clients);




    return (
        <div>
            <h1>{clients}</h1>
        </div>
    )
}

export default ClientsUI;