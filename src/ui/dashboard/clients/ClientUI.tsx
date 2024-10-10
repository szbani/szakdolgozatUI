import {useParams} from "react-router-dom";
import Button from "@mui/joy/Button";
import {useState} from "react";
import Box from "@mui/joy/Box";
import {Grid} from "@mui/joy";
import {useWebSocketContext} from "../../../websocket/WebSocketContext.tsx";

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [fileList, setFileList] = useState([]);
    const {sendFiles} = useWebSocketContext();
    const {clientId} = useParams();

    const handleFileChange = (e) => {
        setFile(e.target.files);
        setFileList(Array.from(e.target.files));
    }

    const handleReset = () => {
        setFile(null);
        setFileList([]);
    }

    const handleUpload = () => {
        sendFiles(file,clientId);
    }


    return (
        <Box>
            <RenderSelectedFiles fileList={fileList}/>
            <Box mt={5}>
                <Button variant={"outlined"}
                        component={'label'}>{file == null ? 'Select File To Upload' : 'Selected Files To Upload: (' + fileList.length + ")"}
                    <input type={'file'} onChange={handleFileChange} hidden multiple/>
                </Button>{file != null ?
                <div><Button color={"success"} onClick={handleUpload}>Upload</Button>
                    <Button color={"danger"} onClick={handleReset}>Reset</Button></div> : null}
            </Box>
        </Box>
    )
}

const RenderSelectedFiles = (props) => {
    return (
        <Grid
            sx={{border: 1, borderColor: 'lightgray', borderRadius: '8px'}}
            container
            spacing={{xs: 1, md: 2}}
            columns={{xs: 2, sm: 4, md: 6, lg: 9}}
            height={300}
            overflow={'scroll'}

        >
            {props.fileList.map((file, index) =>
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