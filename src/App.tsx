import Dashboard from "./ui/dashboard/Dashboard.tsx";
import {WebSocketProvider} from "./websocket/WebSocketContext.tsx";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import ClientsLayout from "./ui/dashboard/Layouts/ClientsLayout.tsx";
import ClientsUI from "./ui/dashboard/clients/ClientsUI.tsx";
import ClientUI from "./ui/dashboard/client/ClientUI.tsx";
import ShowCase from "./ui/showcase/ShowCase.tsx";
import SignInUI from "./ui/Auth/SignIn.tsx";
import {ThemeProvider} from "@mui/material";
import MainTheme from "./Themes/MainTheme/MainTheme.ts";
import CssBaseline from "@mui/material/CssBaseline";
import AccountTable from "./ui/dashboard/Accounts/AccountTable.tsx";
import PlaylistsLayout from "./ui/dashboard/Layouts/PlaylistsLayout.tsx";
import PlaylistsUI from "./ui/dashboard/playlists/PlaylistsUI.tsx";
import PlaylistUI from "./ui/dashboard/Playlist/PlaylistUI.tsx";


const App = () => {

    return (
        <ThemeProvider theme={MainTheme}>
            <CssBaseline></CssBaseline>
            <Router>
                <Routes>
                    <Route path="signin" element={<SignInUI/>}></Route>
                    <Route path="/" element={<WebSocketProvider><Dashboard/></WebSocketProvider>}>
                        <Route path="*"></Route>
                        <Route path="displays" element={<ClientsLayout/>}>
                            <Route index element={<ClientsUI/>}/>
                            <Route path={"client/:clientId"} element={<ClientUI/>}/>
                        </Route>
                        <Route path={"accounts"} element={<AccountTable/>}/>
                        <Route path="playlists" element={<PlaylistsLayout/>}>
                            <Route index element={<PlaylistsUI/>}/>
                            <Route path={":clientId"} element={<PlaylistUI/>}/>
                        </Route>
                    </Route>
                    <Route path="showcase" element={<ShowCase/>}></Route>
                </Routes>
            </Router>
        </ThemeProvider>
    )
}

export default App
