import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import {CardContent} from "@mui/material";
import Timeline from "../components/Test.tsx";

const ActionsTiming = () => {
    return (
        <Card sx={{marginBottom:4}}>
        <CardHeader title={'Actions Time Table'}></CardHeader>
            <CardContent>
                <Timeline></Timeline>
            </CardContent>
        </Card>
    );
}

export default ActionsTiming;