import {Snackbar} from "@mui/joy";
import {Close, Error} from "@mui/icons-material";
import Button from "@mui/joy/Button";
import {useEffect, useState} from "react";
import {ColorPaletteProp} from "@mui/joy/styles";

export interface SnackbarProps {
    setOpen: (open: boolean) => void;
    open: boolean;
    message: string;
    status:  ColorPaletteProp;
}

export const AppSnackbar = (props: SnackbarProps) => {
    const [open, setOpen] = useState(false);
    // console.log("props", props);
    const status = props.status;
    const message = props.message;
    useEffect(() => {
        // console.log("open", props.open);
        if (message != "" && props.open)
            setOpen(true);
        props.setOpen(false);
    }, [props.open]);
    return (
        <Snackbar
            color={status}
            variant={"soft"}
            size={"lg"}
            open={open}
            autoHideDuration={10000}
            // @ts-ignore
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
                    color={status}
                >
                    <Close/>
                </Button>}
        >
            {message}
        </Snackbar>
    )
}