import './App.css'
import Dashboard from "./ui/dashboard/Dashboard.tsx";
import {WebSocketProvider} from "./websocket/WebSocketContext.tsx";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import OrderTable from "./ui/dashboard/components/OrderTable.tsx";
import OrderList from "./ui/dashboard/components/OrderList.tsx";
import ClientsLayout from "./ui/dashboard/strclients/ClientsLayout.tsx";
import ClientsUI from "./ui/dashboard/strclients/ClientsUI.tsx";
import ClientUI from "./ui/dashboard/strclients/ClientUI.tsx";

function App() {

    return (
        <WebSocketProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Dashboard/>}>
                        <Route index element={<><OrderTable/><OrderList/></>}/>
                        <Route path="streamingclients" element={<ClientsLayout/>}>
                            <Route index element={<ClientsUI/>}/>
                            <Route path={"client"} element={<ClientUI/>}/>
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </WebSocketProvider>
)
}

export default App
