// @ts-ignore
import {useState} from "react";
import {useWebSocketContext} from "../../../websocket/WebSocketContext.tsx";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import {
    AddToQueue,
    DeleteForever,
    Edit,
    MoreVertRounded,
    PowerOff,
    PowerSettingsNew,
    RestartAlt
} from "@mui/icons-material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

const ErrorMenuStyle = {
    ["ul"]: {
        paddingBottom: "0px!important",
        gap: 1,
    }
}
const ErrorMenuItemStyle = {
    paddingY: "12px",
    gap: 1,
    backgroundColor: "error.main",
    color: "error.light",
    "&:hover": {
        backgroundColor: "error.light",
        color: "error.dark",
        transition: "background-color 0.05s",
    },
    transition: "background-color 0.05s",
}

// @ts-ignore
export const Client = ({client, index, EditDialogHandler}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // @ts-ignore
    const {sendMessage} = useWebSocketContext();

    const DisconnectDisplay = (clientId: string) => {
        setAnchorEl(null);
        const jsonToSend = JSON.stringify({
            type: 'Disconnect',
            targetUser: clientId,
        });
        sendMessage(jsonToSend);
    }

    const RebootDisplay = (clientId: string) => {
        setAnchorEl(null);
        const jsonToSend = JSON.stringify({
            type: 'RebootDisplay',
            targetUser: clientId,
        });
        sendMessage(jsonToSend);
    }

    const WakeUpDisplay = (NickName: string) => {
        setAnchorEl(null);
        const jsonToSend = JSON.stringify({
            type: 'StartDisplay',
            targetUser: NickName,
        });
        sendMessage(jsonToSend);
    }

    const unRegisterDisplay = (clientId: string) => {
        setAnchorEl(null);
        const jsonToSend = JSON.stringify({
            type: 'RemoveRegisteredDisplay',
            targetUser: clientId,
        });
        sendMessage(jsonToSend);
    }

    const RegisterDisplay = (clientId: string) => {
        setAnchorEl(null);
        const jsonToSend = JSON.stringify({
            type: 'RegisterDisplay',
            targetUser: clientId,
            displayDescription: "Kiosk",
        });
        sendMessage(jsonToSend);
    }

    const handleOpenEditDialog = () => {
        setAnchorEl(null);
        EditDialogHandler.setOpenEditDialog(true);
        EditDialogHandler.setEditDialogData(client);
    }

    return (
        <Box>
            <IconButton
                id={`client-${index}-button`}
                sx={{border: "none", padding: "12px", height: "min-content"}}
                aria-controls={open ? `client-${index}-menu` : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}>
                <MoreVertRounded/>
            </IconButton>
            {
                client.Status ?
                    <Menu
                        id={`client-${index}-menu`}
                        aria-labelledby={`client-${index}-button`}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        sx={ErrorMenuStyle}
                    >
                        <MenuItem
                            onClick={() => handleOpenEditDialog()}
                            sx={{gap: 1}}
                        >
                            <Edit/>
                            <Typography>Edit</Typography>
                        </MenuItem>
                        <MenuItem
                            onClick={() => WakeUpDisplay(client.NickName)}
                            sx={{gap: 1}}
                        >
                            <PowerSettingsNew/>
                            <Typography>Wake Up</Typography>
                        </MenuItem>
                        <Divider sx={{marginBottom: "0px!important"}}/>
                        <MenuItem
                            onClick={() => unRegisterDisplay(client.NickName)}
                            sx={ErrorMenuItemStyle}
                        >
                            <DeleteForever/>
                            <Typography>UnRegister</Typography>
                        </MenuItem>
                    </Menu> :
                    client.NickName ?
                        <Menu
                            id={`client-${index}-menu`}
                            aria-labelledby={`client-${index}-button`}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            sx={ErrorMenuStyle}
                            // sx={{gap: 1}}
                        >
                            <MenuItem
                                onClick={() => handleOpenEditDialog()}
                                sx={{gap: 1}}
                            >
                                <Edit/>
                                <Typography>Edit</Typography>
                            </MenuItem>
                            <MenuItem
                                sx={{paddingBottom: "12px", marginTop: "0px", gap: 1}}
                                color="danger"
                                onClick={() => RebootDisplay(client.KioskName)}
                            >
                                <RestartAlt/>
                                <Typography>Reboot</Typography>
                            </MenuItem>
                            <MenuItem
                                sx={ErrorMenuItemStyle}
                                onClick={() => DisconnectDisplay(client.KioskName)}
                            >
                                <PowerOff/>
                                <Typography>ShutDown</Typography>
                            </MenuItem>
                        </Menu> :
                        <Menu
                            id={`client-${index}-menu`}
                            aria-labelledby={`client-${index}-button`}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            sx={ErrorMenuStyle}
                        >
                            <MenuItem
                                onClick={() => RegisterDisplay(client.KioskName)}
                                sx={{paddingY: "9px", gap: 1}}
                            >
                                <AddToQueue/>
                                <Typography>Register</Typography>
                            </MenuItem>
                        </Menu>

            }
        </Box>
    );
};