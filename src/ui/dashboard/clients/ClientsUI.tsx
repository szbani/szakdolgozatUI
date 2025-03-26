import {useWebSocketContext} from "../../../websocket/WebSocketContext.tsx";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import {useState} from "react";
import {ClientEditDialog} from "./ClientEditDialog.tsx";
import {ClientCards} from "./ClientCards.tsx";
import Box from "@mui/material/Box";

export interface IClient {
    Id: number;
    NickName: string;
    KioskName: string;
    Description: string;
    Status: boolean;
}

const ClientsUI = () => {
    // @ts-ignore
    const {registeredDisplays, unRegisteredDisplays} = useWebSocketContext() || [];

    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
    const [editDialogData, setEditDialogData] = useState<IClient>({
        Id: 0,
        NickName: "",
        KioskName: "",
        Description: "",
        Status: false,
    });

    return (
        <Box>
            <Box bgcolor={'background.paper'} padding={2} borderRadius={3} boxShadow={2} marginBottom={2}>
                <Typography fontSize="20px" fontWeight="bold">Registered Displays</Typography>

                <Grid
                    container
                    spacing={{xs: 2, md: 3}}
                    columns={{xs: 4, sm: 8, md: 12, lg: 10.5, xl:13}}
                    marginY={{xs: 0.75, sm: 1.5}}
                    sx={{flexGrow: 1}}
                >
                    {registeredDisplays.length === 0 ?
                        <Typography fontSize={16}>
                            No Registered Displays
                        </Typography> : ClientCards(registeredDisplays, {
                            setOpenEditDialog: setOpenEditDialog,
                            setEditDialogData: setEditDialogData
                        })}
                </Grid>
            </Box>
            <Box bgcolor={'background.paper'} padding={2} borderRadius={3} boxShadow={2}>
                <Typography fontSize="20px" fontWeight="bold">UnRegistered Displays</Typography>
                <Grid
                    container
                    spacing={{xs: 2, md: 3}}
                    columns={{xs: 4, sm: 8, md: 12, lg: 10.5, xl:13}}
                    marginY={{xs: 0.75, sm: 1.5}}
                    sx={{flexGrow: 1}}
                >
                    {unRegisteredDisplays.length === 0 ?
                        <Typography fontSize={16}>No Displays
                            Connected</Typography> : ClientCards(unRegisteredDisplays, {
                            setOpenEditDialog: setOpenEditDialog,
                            setEditDialogData: setEditDialogData
                        })}
                </Grid>
                <ClientEditDialog
                    client={editDialogData}
                    open={openEditDialog}
                    setOpen={setOpenEditDialog}>
                </ClientEditDialog>
            </Box>
        </Box>
    )
}

export default ClientsUI;