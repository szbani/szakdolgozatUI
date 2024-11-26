
import Box from '@mui/material/Box';
import {Outlet} from "react-router-dom";
import {AppSnackbar} from "./components/Snackbars.tsx";
import {useWebSocketContext} from "../../websocket/WebSocketContext.tsx";
import ResponsiveDrawer from "./components/Sidebar";
import {ThemeProvider} from "@mui/material";
import {MainTheme} from "../../Themes/MainTheme/MainTheme.ts";
import CssBaseline from "@mui/material/CssBaseline";

export default function Dashboard() {
    //@ts-ignore
    const {snackbarProps} = useWebSocketContext();
    return (
        <ThemeProvider theme={MainTheme}>
            <CssBaseline/>
            <Box sx={{display: 'flex', minHeight: '100dvh'}}>
                {/*<Header/>*/}
                <ResponsiveDrawer/>
                <Box
                    marginTop={{xs: 10, md: 2}}
                    marginLeft={{xs: 0, md: 2}}
                    component="main"
                    className="MainContent"
                    sx={{
                        px: {xs: 2, md: 1},
                        pr: {md: 5},
                        pt: {
                            xs: 'calc(12px + var(--Header-height))',
                            sm: 'calc(12px + var(--Header-height))',
                            md: 3,
                        },
                        pb: {xs: 2, sm: 2, md: 3},
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
                <AppSnackbar
                    setOpen={snackbarProps.setOpen}
                    open={snackbarProps.open}
                    message={snackbarProps.message}
                    status={snackbarProps.status}/>
            </Box>
        </ThemeProvider>
    );
}