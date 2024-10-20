//@ts-nocheck
import {useParams} from "react-router-dom";
import Button from "@mui/joy/Button";
import {Key, useEffect, useState} from "react";
import Box from "@mui/joy/Box";
import {Grid} from "@mui/joy";
import {useWebSocketContext} from "../../../websocket/WebSocketContext.tsx";
import {FilePond, File, registerPlugin} from "filepond";

const FileUpload = () => {
    const [fileList, setFileList] = useState([]);
    const [mediaType, setMediaType] = useState<string>('image');
    // @ts-ignore
    const {sendMessage, uploading, setUploading} = useWebSocketContext();
    const {clientId} = useParams();
    const [filesToUpload, setFilesToUpload] = useState<File[]>([]);





    const handleImageChange = (e: any) => {
        setFileList(Array.from(e.target.files));
        setMediaType('image');
    }

    const handleVideoChange = (e: any) => {
        setFileList(Array.from(e.target.files));
        setMediaType('video');
    }

    const handleReset = () => {
        setFileList([]);
    }

    const handleUpload = () => {
        const jsonToSend = JSON.stringify({
            type: 'startingFileStream',
            targetUser: clientId,
            deleteFiles: true,
            mediaType: mediaType
        });
        sendMessage(jsonToSend);
        setFilesToUpload(fileList);
        setUploading(true);
    }

    useEffect(() => {
        //start uploading
        console.log('Uploading:', uploading);
        console.log('FileList:', filesToUpload);
        if (uploading && filesToUpload.length > 0) {
            console.log('Uploading');

            const jsonToSend = JSON.stringify({
                type: 'startFileStream',
                fileName: filesToUpload[0].name,
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
                        console.log('File Uploaded');
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
            console.log('Sending update request');
            const jsonToSend = JSON.stringify({
                type: 'sendUpdateRequestToUser',
                targetUser: clientId
            });
            sendMessage(jsonToSend);
        }
        setUploading(false);
    }, [uploading]);

    const WakeUpDisplay = () => {
        const jsonToSend = JSON.stringify({
            type: 'StartDisplay',
            macAddress: "18:C0:4D:5E:B2:9F",
            address: "192.168.0.50"
        });
        sendMessage(jsonToSend);
    }
    const OpenEdge = () => {
        const jsonToSend = JSON.stringify({
            type: 'OpenEdge',
            address: "192.168.0.50",
            url: "http://localhost:8080",
        });
        sendMessage(jsonToSend);
    }



    return (
        <Box>
            <RenderSelectedFiles fileList={fileList}/>
            <Box mt={5}>
                <Button variant={"outlined"}
                        component={'label'}>{fileList.length == 0 ? 'Select Images' : 'Add More Images To Upload: (' + fileList.length + ")"}
                    <input type={'file'} onChange={handleImageChange} hidden multiple accept={"image/*"}/>
                </Button>
                <Button variant={"outlined"} component={'label'}>
                    {fileList.length == 0 ? 'Select Video To Upload' : 'Selected Diferent Video'}
                    <input type={'file'} onChange={handleVideoChange} hidden accept={"video/*"}></input>
                </Button>
                {fileList.length > 0 ?
                    <div><Button color={"success"} onClick={handleUpload}>Upload</Button>
                        <Button color={"success"} onClick={OpenEdge}>Wake</Button>
                        <Button color={"danger"} onClick={handleReset}>Reset</Button></div> : null}
            </Box>
        </Box>
    )
}


const RenderSelectedFiles = (props: { fileList: File[]; }) => {
    return (
        <Grid
            sx={{border: 1, borderColor: 'lightgray', borderRadius: '8px'}}
            container
            spacing={{xs: 1, md: 2}}
            columns={{xs: 2, sm: 4, md: 6, lg: 9}}
            height={300}
            overflow={'scroll'}

        >
            {props.fileList.map((file: File, index: Key) =>
                <Grid key={index}>
                    {file.type == 'video/mp4' ?
                        <video src={URL.createObjectURL(file)} style={{width: '200px', height: '200px'}}
                               controls></video> : <img src={URL.createObjectURL(file)} alt={file.name}
                                                        style={{width: '200px', height: '200px'}}/>}
                </Grid>
            )}
        </Grid>

    )
}


const ClientUI = () => {
    const params = useParams();
    const client = params.clientId;

    return (
        <div>
            <h1>{client}</h1>
            {/*<Button variant={'outlined'} component={'label'}>Select Video<input type={'file'} accept='video/mp4' hidden/></Button>*/}
            <FileUpload/>
        </div>
    )
}

export default ClientUI;