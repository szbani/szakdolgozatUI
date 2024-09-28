import {Outlet} from "react-router-dom";

const clientsLayout = () => {
    return (
        <div>
            <h1>ClientLayout</h1>
            <Outlet/>
        </div>
    )
}

export default clientsLayout;