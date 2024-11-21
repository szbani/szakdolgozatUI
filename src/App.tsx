import './App.css'
import Dashboard from "./ui/dashboard/Dashboard.tsx";
import {WebSocketProvider} from "./websocket/WebSocketContext.tsx";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import ClientsLayout from "./ui/dashboard/clients/ClientsLayout.tsx";
import ClientsUI from "./ui/dashboard/clients/ClientsUI.tsx";
import ClientUI from "./ui/dashboard/clients/ClientUI.tsx";
import ShowCase from "./ui/showcase/ShowCase.tsx";
import SignInUI from "./ui/Auth/SignIn.tsx";
import Box from "@mui/material/Box";



const App = () => {

    return (

        <Router>
            <Routes>
                <Route path="signin" element={<SignInUI/>}></Route>
                <Route path="/" element={<WebSocketProvider><Dashboard/></WebSocketProvider>}>
                    <Route index element={<Box>test</Box>}/>
                    <Route path="displays" element={<ClientsLayout/>}>
                        <Route index element={<ClientsUI/>}/>
                        <Route path={"client/:clientId"} element={<ClientUI/>}/>
                    </Route>
                </Route>
                <Route path="showcase" element={<ShowCase/>}></Route>
            </Routes>
        </Router>

    )
}

export default App
