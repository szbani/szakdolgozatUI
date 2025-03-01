import FormControl from "@mui/material/FormControl";
import {
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    InputLabel,
    Select,
    SelectChangeEvent, useTheme
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import {LocalizationProvider, MobileTimePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {useWebSocketContext} from "../../../websocket/WebSocketContext.tsx";
import {changeTimesData} from "./ClientUI.tsx";
import 'dayjs/locale/hu.js';

// @ts-ignore
const Schedule = ({clientId, setTime, selectedTime, times}) => {
    // @ts-ignore
    const {sendMessage} = useWebSocketContext();

    const handleChange = (event: SelectChangeEvent) => {
        setTime(event.target.value);
    }

    useEffect(() => {
        if (times != undefined) {
            setChangeTimes(times);
        }
    }, [times])

    const [start, setStart] = useState<string>("");
    const [end, setEnd] = useState<string>("");
    const [changeTimes, setChangeTimes] = useState<changeTimesData[]>([]);

    const handleClear = () => {
        setStart("");
        setEnd("");
    }

    const handleStartChange = (date: any) => {
        setStart(date.format("HH:mm"));
    }

    const handleEndChange = (date: any) => {
        setEnd(date.format("HH:mm"));
    }

    const handleUpload = () => {
        if (start.toString() !== "" && end.toString() !== "" && start < end) {
            const jsonToSend = {
                type: "AddSchedule",
                targetUser: clientId,
                start: start,
                end: end
            }
            handleCloseDialog();
            setChangeTimes([{start: start, end: end}, ...changeTimes]);
            sendMessage(JSON.stringify(jsonToSend));
        }
    }

    const handleDelete = () => {
        if (selectedTime != "default") {
            const jsonToSend = {
                type: "DeleteSchedule",
                targetUser: clientId,
                changeTime: selectedTime
            }
            sendMessage(JSON.stringify(jsonToSend));
            setTime("default");
            setChangeTimes(changeTimes.filter(time => time.start !== selectedTime));
        }
    }

    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const handleOpenDialog = () => {
        setOpen(true);
    }

    const handleCloseDialog = () => {
        handleClear();
        setOpen(false);
    }

    return (
        <Card sx={{mt: 2}}>
            <CardHeader title={"Time Schedules"} subheader={"Select a time schedule to manage its content."}
                        sx={{pb: 0}}/>
            <CardContent>
                <Box mb={3}>
                    <Button sx={{m: "4px!important"}} onClick={handleOpenDialog}>Add new Schedule</Button>
                    <Button sx={{m: "4px!important"}} onClick={handleDelete}>Delete This Schedule</Button>
                </Box>
                <FormControl sx={{width: "50%"}}>
                    <InputLabel id="ChangeTimeLabel">Currently Managed Time</InputLabel>
                    <Select
                        labelId="ChangeTimeLabel"
                        id="ChangeTimeSelect"
                        value={selectedTime}
                        label="Currently Managed Time"
                        onChange={handleChange}
                    >
                        <MenuItem value={"default"}>Default</MenuItem>
                        {
                            changeTimes.map((time, index) => {
                                return <MenuItem key={index}
                                                 value={time.start}>{time.start + " - " + time.end}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>

                <Dialog
                    open={open}
                    onClose={handleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"New Schedule"}
                    </DialogTitle>
                    <DialogContent sx={{display: "flex", flexDirection: {xs: "column", sm: "row"}}}>
                        <DialogContentText pb={2} pr={1} id="alert-dialog-description">
                            Select Start and End time for the new schedule
                        </DialogContentText>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"hu"}>
                            <MobileTimePicker
                                sx={{width: {xs:"70%",sm:"30%"}, m: "auto", mb: {xs: 2, sm: "auto"}, mr: {xs: "auto", sm: 2}}}
                                label={"Start Time"}
                                slotProps={{
                                    toolbar: {sx: {".MuiButtonBase-root": {backgroundColor: theme.palette.mode == "light" ? "#c0f1e0" : "#374941"}}},
                                }}
                                onChange={handleStartChange}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"hu"}>
                            <MobileTimePicker
                                sx={{width: {xs:"70%",sm:"30%"}, m: "auto"}}
                                label={"End Time"}
                                slotProps={{
                                    toolbar: {sx: {".MuiButtonBase-root": {backgroundColor: theme.palette.mode == "light" ? "#c0f1e0" : "#374941"}}},
                                }}
                                onChange={handleEndChange}
                            />
                        </LocalizationProvider>
                    </DialogContent>
                    <DialogActions>
                        <Button sx={{width: {xs: "50%!important"}}} onClick={handleCloseDialog}>Cancel</Button>
                        <Button sx={{width: {xs: "50%!important"}}} onClick={handleUpload} autoFocus>Add
                            Schedule</Button>
                    </DialogActions>
                </Dialog>
            </CardContent>
        </Card>
    );
}

export default Schedule;