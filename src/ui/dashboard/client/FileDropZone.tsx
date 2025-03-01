//@ts-nocheck
import {useEffect, useMemo, useState} from "react";
import {useDropzone} from "react-dropzone";
import {AppSnackbar} from "../components/Snackbars.tsx";
import {useWebSocketContext} from "../../../websocket/WebSocketContext.tsx";
import {useParams} from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import {green, grey, red} from "@mui/material/colors";
import {useTheme} from "@mui/material";

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: 350,
    overflow: 'auto',
    width: '100%'
};

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 150,
    height: 150,
    padding: 4,
    boxSizing: 'border-box'
};

const img = {
    display: 'block',
    width: 'inherit',
    height: '100%',
    objectFit: 'contain'
};

const videoThumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginRight: 8,
    // width: "100%",
    height: "100%",
    objectFit: 'fits',
    padding: 4,
    boxSizing: 'border-box'
}

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    height: 'inherit',
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};
const focusedStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};


export const FileDropZone = (props) => {
    const theme = useTheme();
    const [eSnackbarMessage, seteSnackbarMessage] = useState("");
    const [eSnackbarOpen, seteSnackbarOpen] = useState(false);
    const [eSnackbarStatus, seteSnackbarStatus] = useState<string>("neutral");

    // @ts-ignore
    const {sendMessage, uploading, setUploading, fileNames, setNewConfig} = useWebSocketContext();
    const {clientId} = useParams();
    const [filesToUpload, setFilesToUpload] = useState<File[]>([]);

    const [files, setFiles] = useState([]);
    const {
        fileRejections,
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject
    } = props.acceptedFileType == "video" ? useDropzone({
        accept: {'video/*': []},
        maxFiles: 1,
        maxSize: 5368709120,
        onDrop: acceptedFiles => {
            // @ts-ignore
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        },
        noDragEventsBubbling: true,
        multiple: false
    }) : useDropzone({
        accept: {'image/*': []},
        maxFiles: 15,
        maxSize: 104857600,
        onDrop: acceptedFiles => {
            // @ts-ignore
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        },
        noDragEventsBubbling: true,
        multiple: true
    });

    useEffect(() => {
        setFiles([]);
    }, [fileNames]);

    const handleUpload = () => {
        const jsonToSend = JSON.stringify({
            type: 'prepareFileStream',
            targetUser: clientId,
            mediaType: props.acceptedFileType,
            changeTime: props.changeTime
        });
        sendMessage(jsonToSend);
        setFilesToUpload(files);
        setUploading(true);
    }

    useEffect(() => {
        //start uploading
        if (uploading && filesToUpload.length > 0) {

            const type = filesToUpload[0].name.split('.');
            const jsonToSend = JSON.stringify({
                type: 'startFileStream',
                fileType: type[type.length - 1],
                changeTime: props.changeTime
            });
            sendMessage(jsonToSend);

            const chunkSize = 1024 * 256;
            const reader = new FileReader();

            let offset: number = 0;

            const file: File = filesToUpload[0];

            const readSlice = (file: File, offset: number) => {
                const slice = file.slice(offset, offset + chunkSize);
                reader.readAsArrayBuffer(slice);
            }

            reader.onload = (event: ProgressEvent<FileReader>) => {
                if (event.target?.result) {
                    const buffer = event.target.result as ArrayBuffer;
                    sendMessage(buffer);
                    offset += buffer.byteLength;
                    console.log(buffer.byteLength);
                    if (offset < file.size) {
                        readSlice(file, offset);
                    } else {
                        const jsonToSend = JSON.stringify({
                            type: 'endFileStream',
                            targetUser: clientId
                        });
                        sendMessage(jsonToSend);

                    }
                }
            }
            setFilesToUpload(filesToUpload.slice(1));
            readSlice(file, offset);
        }
        if (uploading && filesToUpload.length == 0) {
            const jsonToSend = JSON.stringify({
                type: 'createImagePathConfig',
                targetUser: clientId,
                changeTime: props.changeTime
            });
            sendMessage(jsonToSend);
            const jsonToSend2 = JSON.stringify({
                type: 'sendUpdateRequestToUser',
                targetUser: clientId
            });
            sendMessage(jsonToSend2);
            setNewConfig(true);
        }
        setUploading(false);
    }, [uploading]);

    const errors = fileRejections.map(({file, errors}) => {
        const message = errors.map(e => e.message).join(', ');
        return {file, message};
    });

    const thumbs = files.map(file => (
        <Box style={props.acceptedFileType == "video" ? videoThumb : thumb} key={file.name}>
            {props.acceptedFileType == "video" ?
                <video src={file.preview} controls muted loop onLoad={() => {
                    URL.revokeObjectURL(file.preview)
                }}/>
                : <img
                    src={file.preview}
                    style={img}
                    // Revoke data uri after image is loaded
                    onLoad={() => {
                        URL.revokeObjectURL(file.preview)
                    }}
                />}
        </Box>
    ));

    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        return () => files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    useEffect(() => {
        if (errors.length == 0) {
            seteSnackbarMessage("");
            seteSnackbarOpen(false);
        } else if (errors.length > 1 && props.acceptedFiles == "Video") {
            seteSnackbarMessage("Multiple files rejected. Please upload only 1 video file");
            seteSnackbarOpen(true);
            seteSnackbarStatus("error");
        } else if (errors.length > 15) {
            seteSnackbarMessage("Multiple files rejected. Please upload only 15 image files");
            seteSnackbarOpen(true);
            seteSnackbarStatus("error");
        } else if (errors.length > 0) {
            seteSnackbarMessage(errors[0].message);
            seteSnackbarOpen(true);
            seteSnackbarStatus("error");
        }
    }, [errors.length]);

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {}),
        backgroundColor: isDragReject ? red[200] : isDragAccept ? green[200]
            : theme.palette.mode == 'light' ? grey[200] : grey[800],
        color: theme.palette.mode == 'light' ? grey[800] : grey[200],
        borderColor: theme.palette.mode == 'light' ? grey[400] : grey[600],
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);

    return (
        <Box>
            <section className="container">
                <Grid container spacing={2}>
                    <Grid size={{xs: 12, md: 2.5, lg: 4.5, xl:6}} sx={{
                        textAlign: "center",
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                    }} {...getRootProps({style})}>
                        <input {...getInputProps()} />
                        {props.acceptedFileType == "video" ?
                            <p>Drag 'n' drop a video file here, or click to select a file</p> :
                            <p>Drag 'n' drop some Images here, or click to select files (15 max)</p>}
                    </Grid>
                    <Grid size={{xs: 12,  md: 9.5, lg: 7.5, xl: 6}}>
                        <aside style={thumbsContainer}>
                            {thumbs}
                            <AppSnackbar message={eSnackbarMessage} open={eSnackbarOpen} setOpen={seteSnackbarOpen}
                                         status={eSnackbarStatus}></AppSnackbar>
                        </aside>
                    </Grid>
                    <Grid minHeight={50} size={12}>
                        {files.length > 0 ?
                            <>
                                {props.acceptedFileType == "image" ?
                                    <Button
                                        disabled={uploading}
                                        onClick={() => handleUpload()}
                                        sx={{marginRight: 1}}
                                    >
                                        {uploading ? "Uploading " : "Upload Images"}
                                    </Button> :
                                    <Button
                                        disabled={uploading}
                                        onClick={() => handleUpload()}
                                        sx={{marginRight: 1}}
                                    >
                                        {uploading ? "Uploading " : "Upload Video"}
                                    </Button>
                                }
                            </>
                            : null}
                    </Grid>
                </Grid>
            </section>
        </Box>
    );
}