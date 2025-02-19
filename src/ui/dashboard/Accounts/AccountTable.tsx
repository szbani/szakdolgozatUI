//@ts-nocheck
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    GridRowEditStopReasons,
    GridSlotProps,
} from '@mui/x-data-grid';
import {useEffect, useRef, useState} from "react";
import {useWebSocketContext} from "../../../websocket/WebSocketContext.tsx";

declare module '@mui/x-data-grid' {
    interface ToolbarPropsOverrides {
        setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
        setRowModesModel: (
            newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
        ) => void;
    }
}

function EditToolbar(props: GridSlotProps['toolbar']) {
    const { setRows, setRowModesModel } = props;
    const id = useRef(0);
    const handleClick = () => {
        // @ts-ignore
        id.current += 1;
        const idref = id.current;
        setRows((oldRows) => [
            ...oldRows,
            {id: idref, name: '', age: '', role: '', isNew: true },
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [idref]: { mode: GridRowModes.Edit, fieldToFocus: 'UserName' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add record
            </Button>
        </GridToolbarContainer>
    );
}

const AccountTable = () => {
    // @ts-ignore
    const {sendMessage, admins, getAdminList, setAdmins} = useWebSocketContext();

    const [rows, setRows] = useState( []);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    useEffect(() => {
        getAdminList();
    },[]);

    useEffect(() => {
        if (admins.length > 0) {
            console.log("admins: ", JSON.parse(admins));
            let res = JSON.parse(admins);
            res = res.map((admin, index) => {
                return {
                    id: admin.id,
                    UserName: admin.UserName,
                    Email: admin.Email,
                    password: "********",
                };
            });
            setRows(res);
        }
    }, [admins]);

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        let row = rows.find((row) => row.id == id);
        row.password = "";

        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        //handle own account deleting
        const row = rows.find((row) => row.id === id);

        if (row.UserName == "admin") {
            return;
        }
        sendMessage(JSON.stringify({type: "DeleteAdmin", id: id, sender: "admin"}));
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        editedRow!.password = "********";
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        const oldRow = rows.find((row) => row.id === newRow.id);
        if(oldRow.UserName == "admin") {
            return oldRow;
        }

        const updatedRow = { ...newRow, isNew: false };
        // console.log("data: ",{type: "UpdateAdmin", id: row.id, username: updatedRow.UserName, email: updatedRow.Email, password: updatedRow.password});
        // console.log("oldRow: ", oldRow);
        // console.log("updatedRow: ", updatedRow);
        // console.log((updatedRow.UserName === oldRow.UserName && updatedRow.Email === oldRow.Email && updatedRow.password === oldRow.password));
        // @ts-ignore
        if (updatedRow.UserName != oldRow.UserName || updatedRow.Email != oldRow.Email || updatedRow.password != oldRow.password) {
            console.log("Changes");
            // @ts-ignore
            sendMessage(JSON.stringify({
                type: "UpdateAdmin",
                id: newRow.id.toString(),
                username: updatedRow.UserName,
                email: updatedRow.Email,
                password: updatedRow.password
            }));
        }
        // @ts-ignore
        oldRow.password = "********";
        // @ts-ignore
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            type: 'string',
            width: 220,
            align: 'left',
            headerAlign: 'left',
            editable: false,
        },
        {
            field: 'UserName',
            headerName: 'UserName',
            type: 'string',
            width: 180,
            align: 'left',
            headerAlign: 'left',
            editable: true,
        },
        {
            field: 'Email',
            headerName: 'Email',
            width: 300,
            editable: true,
            type: 'string',
        },
        {
            field: 'password',
            headerName: 'Password',
            width: 220,
            editable: true,
            type: 'string',

        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    let rowID = 0;

    return (
        <Box bgcolor={'background.paper'} padding={1} borderRadius={3} boxShadow={2} marginBottom={2}
            sx={{
                height: 500,
                width: '100%',
                '& .actions': {
                    color: 'text.secondary',
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },
            }}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{ toolbar: EditToolbar }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel, sendMessage, id: rowID },
                }}
            />
        </Box>
    );
}

export default AccountTable;
