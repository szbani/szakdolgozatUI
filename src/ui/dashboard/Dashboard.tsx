//@ts-nocheck
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import {Outlet} from "react-router-dom";
import {AppSnackbar} from "./components/Snackbars.tsx";
import React from "react";
import {useWebSocketContext} from "../../websocket/WebSocketContext.tsx";

export default function Dashboard() {
    const {snackbarProps} = useWebSocketContext();
    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
                <Header />
                <Sidebar />
                <Box
                    component="main"
                    className="MainContent"
                    sx={{
                        px: { xs: 2, md: 5 },
                        pt: {
                            xs: 'calc(12px + var(--Header-height))',
                            sm: 'calc(12px + var(--Header-height))',
                            md: 3,
                        },
                        pb: { xs: 2, sm: 2, md: 3 },
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                        height: '100dvh',
                        gap: 1,
                    }}
                >
                    <Outlet/>
                </Box>
            </Box>
            <AppSnackbar setOpen={snackbarProps.setOpen} open={snackbarProps.open} message={snackbarProps.message} status={snackbarProps.status}/>
        </CssVarsProvider>
    );
}