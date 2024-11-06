import {Alert, Snackbar} from "@mui/joy";
import {Close, Error} from "@mui/icons-material";
import Button from "@mui/joy/Button";
import {useEffect, useState} from "react";

interface SnackbarProps {
    setOpen: (open: boolean) => void;
    open: boolean;
    message: string;
}

export const SuccessSnackbar = (props: SnackbarProps) => {
    const [open, setOpen] = useState(props.open);
    const message = props.message;
    return (
        <Snackbar
            color={"success"}
            variant={"soft"}
            size={"lg"}
            open={open}
            autoHideDuration={6000}
            onClose={(event, reason) => {
                if (reason === 'clickaway') {
                    return;
                }
                setOpen(false);
            }}
            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
            startDecorator={<Error/>}
            endDecorator={
                <Button
                    onClick={() => setOpen(false)}
                    size={"sm"}
                    color={"success"}
                    variant={"soft"}
                >
                    <Close/>
                </Button>}
        >
            {message}
        </Snackbar>
    )
}

export const ErrorSnackbar = (props: SnackbarProps) => {
    const [open, setOpen] = useState(false);
    const message = props.message;
    useEffect(() => {
        console.log("open", props.open);
        if (message != "" && props.open)
            setOpen(true);
        props.setOpen(false);
    }, [props.open]);
    return (
        <Snackbar
            color={"danger"}
            variant={"soft"}
            size={"lg"}
            open={open}
            autoHideDuration={10000}
            onClose={(event, reason) => {
                if (reason === 'clickaway') {
                    return;
                }
                setOpen(false);
            }}
            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
            startDecorator={<Error/>}
            endDecorator={
                <Button
                    onClick={() => setOpen(false)}
                    size={"sm"}
                    variant={"soft"}
                    color={"danger"}
                >
                    <Close/>
                </Button>}
        >
            {message}
        </Snackbar>
    )
}