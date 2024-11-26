import Box from "@mui/material/Box";
import {
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Slide,
    TextField
} from "@mui/material";
import Button from "@mui/material/Button";
import {TransitionProps} from "@mui/material/transitions";
import {ChangeEvent, forwardRef, ReactElement, useEffect, useState} from "react";
import {useWebSocketContext} from "../../../websocket/WebSocketContext.tsx";
import Typography from "@mui/material/Typography";
import {IClient} from "./ClientsUI.tsx";

export interface ClientEditDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    client: IClient;
}

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const ClientEditDialog = (props: ClientEditDialogProps) => {

    // @ts-ignore
    const {sendMessage} = useWebSocketContext();
    const [nameToSend, setNameToSend] = useState<string>(props.client.NickName || '');
    const [descriptionToSend, setDescriptionToSend] = useState<string>(props.client.Description || '');
    const [macAddressToSend, setMacAddressToSend] = useState<string>('');
    const [editMacAddress, setEditMacAddress] = useState<boolean>(false);

    useEffect(() => {
        setNameToSend(props.client.NickName || '');
        setDescriptionToSend(props.client.Description || '');
        setMacAddressToSend('');
        setEditMacAddress(false);
    }, [props.open]);

    const handleClose = () => {
        props.setOpen(false);
    }

    const errorCheck = () => {
        if (nameToSend.length > 32 || nameToSend.length === 0) {
            return true;
        }
        if (descriptionToSend.length > 128) {
            return true;
        }
        if (editMacAddress && macAddressCheck(macAddressToSend)) {
            return true;
        }
        return false;
    }

    const macAddressCheck = (macAddress: string) => {
        if (macAddress.length !== 17 || macAddress === '' || /^[0-9A-Fa-f]{2}(:[0-9A-Fa-f]{2}){5}$/.test(macAddress) === false) {
            return true;
        }
        return false;
    }

    const handleSave = () => {
        if (!errorCheck()) {
            props.setOpen(false);
            const jsonToSend = JSON.stringify({
                type: 'ModifyRegisteredDisplay',
                id: props.client.Id,
                nickName: nameToSend,
                description: descriptionToSend,
                macAddress: editMacAddress ? macAddressToSend : null
            });
            sendMessage(jsonToSend);
        }
    }

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setNameToSend(event.target.value);
    }

    const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDescriptionToSend(event.target.value);
    }

    const handleMacAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMacAddressToSend(event.target.value);
    }

    const handleEditMacAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEditMacAddress(event.target.checked);
    }

    return (
        <Box>
            <Dialog
                open={props.open}
                TransitionComponent={Transition}
                onClose={handleClose}
                keepMounted
            >
                <DialogTitle>
                    Edit Display<br/>
                    <Typography
                        color="text.secondary">
                        {props.client.NickName}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            paddingTop: "8px!important",
                            display: {xs: "block", sm: "flex"},
                            gap: 2
                        }}
                    >
                        <Box marginBottom={2}>
                            <TextField
                                error={nameToSend.length > 32 || nameToSend.length === 0}
                                placeholder="Name"
                                label={"Name"}
                                value={nameToSend}
                                helperText={nameToSend.length + "/32"}
                                onChange={handleNameChange}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <TextField
                                error={descriptionToSend.length > 128}
                                placeholder="Description"
                                label={"Description"}
                                value={descriptionToSend}
                                helperText={descriptionToSend.length + "/128"}
                                onChange={handleDescriptionChange}
                            />
                        </Box>
                    </Box>
                    <Typography variant={"subtitle1"}>Mac Address</Typography>
                    <Box
                        sx={{
                            paddingTop: "8px!important",
                            display: {xs: "block", sm: "flex"},
                            gap: 2
                        }}
                    >
                        <Box>
                            <FormControlLabel
                                control={<Checkbox checked={editMacAddress} onChange={handleEditMacAddressChange}/>}
                                label={"Edit MAC Address"}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <TextField
                                error={macAddressCheck(macAddressToSend) && editMacAddress}
                                placeholder="00:00:00:00:00:00"
                                label={"MAC Address"}
                                value={macAddressToSend || ""}
                                onChange={handleMacAddressChange}
                                helperText={"Format: 00:00:00:00:00:00"}
                                disabled={!editMacAddress}
                            />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={errorCheck()}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )

}