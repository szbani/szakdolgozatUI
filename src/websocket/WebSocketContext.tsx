//@ts-nocheck
import React, {createContext, useContext} from "react";
import {Websocket} from "./WebSocketBase.ts";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({children}: {children: React.ReactNode}) => {
    const socket = Websocket();

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
}

export const useWebSocketContext = () => useContext(WebSocketContext);



