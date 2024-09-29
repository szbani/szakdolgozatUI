import { useSearchParams } from 'react-router-dom';
import {useEffect, useState} from "react";
import {ClientWebSocket} from "../../websocket/ClientWebSocketBase.ts";


const ShowCase = () => {
    const [searchParams] = useSearchParams();
    let socket = null;

    if (searchParams.get('username') !== null) {
        socket = ClientWebSocket(searchParams.get('username'));
    }else{
        console.log('Cant Connect To WS');
    }

    return (
        <div>
            <h1>ShowCase</h1>
            <p>Here you can see a list of components and their usage</p>
        </div>
    )
}

export default ShowCase;