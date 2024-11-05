//@ts-nocheck
import React, {createContext, useContext, useEffect, useState} from "react";
import {Websocket} from "./WebSocketBase.ts";
import {loadConfig} from "../config.ts";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({children}: {children: React.ReactNode}) => {
    const [socketUrl, setSocketUrl] = useState<string>("");
    const socket = Websocket(socketUrl);

    useEffect(() => {
        const setWebsocketURL = async () => {
            try {
                const config = await loadConfig();
                try {
                    if (config !== null) {
                        console.log('Connecting to WS');
                        setSocketUrl(`${config.websocket}/ws`);
                    }
                } catch (error) {
                    console.error('Error connecting to WS:', error);
                }
            } catch (error) {
                console.error('Error loading config:', error);
            }
        }
        setWebsocketURL();
    }, []);

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
}

export const useWebSocketContext = () => useContext(WebSocketContext);



