import {Alert, AlertColor, Snackbar} from "@mui/material";
import {CloseRounded} from "@mui/icons-material";
import Button from "@mui/material/Button";
import {useEffect, useState} from "react";

export interface SnackbarProps {
    setOpen: (open: boolean) => void;
    open: boolean;
    message: string;
    status:  AlertColor;
}

export const AppSnackbar = (props: SnackbarProps) => {
    const [open, setOpen] = useState(false);
    const status = props.status;
    const message = props.message;
    useEffect(() => {
        if (message != "" && props.open)
            setOpen(true);
        // props.setOpen(false);
    }, [props.open]);
    return (
        <Snackbar
            open={open}
            autoHideDuration={10000}
            // @ts-ignore
            onClose={(event, reason) => {
                if (reason === 'clickaway') {
                    return;
                }
                setOpen(false);
                props.setOpen(false);
            }}
            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        >
            <Alert
                severity={status}
                action={
                    <Button
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setOpen(false);
                            props.setOpen(false);
                        }}
                        sx={{backgroundColor: status}}
                    >
                        <CloseRounded fontSize={"small"}/>
                    </Button>
                }
                sx={{padding:1,fontSize: "1rem"}}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}