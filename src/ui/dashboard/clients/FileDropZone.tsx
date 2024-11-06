import {useEffect, useState} from "react";
import {useDropzone} from "react-dropzone";
import {ErrorSnackbar} from "../components/Snackbars.tsx";

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
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

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
};

const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
};

const videoThumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 'auto',
    height: 250,
    padding: 4,
    boxSizing: 'border-box'
}




export const FileDropZone = (props) => {
    const [eSnackbarMessage, seteSnackbarMessage] = useState("");
    const [eSnackbarOpen, seteSnackbarOpen] = useState(false);

    const [files, setFiles] = useState([]);
    const {fileRejections,getRootProps, getInputProps} = props.acceptedFileType == "Video" ? useDropzone({
        accept: {'video/*':[]},
        maxFiles: 1,
        onDrop: acceptedFiles => {
            // @ts-ignore
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    }): useDropzone({
        accept: {'image/*':[]},
        maxFiles: 15,
        onDrop: acceptedFiles => {
            // @ts-ignore
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });

    const errors = fileRejections.map(({ file, errors }) => {
        const message = errors.map(e => e.message).join(', ');
        return { file, message };
    });

    const thumbs = files.map(file => (
        <div style={props.acceptedFileType =="Video" ? videoThumb :thumb} key={file.name}>
            <div style={thumbInner}>
                {props.acceptedFileType =="Video" ?
                    <video src={file.preview} controls muted loop onLoad={() => {
                        URL.revokeObjectURL(file.preview)
                    }}/>
                    :<img
                    src={file.preview}
                    style={img}
                    // Revoke data uri after image is loaded
                    onLoad={() => {
                        URL.revokeObjectURL(file.preview)
                    }}
                />}
            </div>
        </div>
    ));

    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        return () => files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    useEffect(() => {
        if(errors.length == 0){
            seteSnackbarMessage("");
            seteSnackbarOpen(false);
        }
        else if (errors.length > 1 && props.acceptedFiles == "Video"){
            seteSnackbarMessage("Multiple files rejected. Please upload only 1 video file");
            seteSnackbarOpen(true);
        }else if (errors.length > 15){
            seteSnackbarMessage("Multiple files rejected. Please upload only 15 image files");
            seteSnackbarOpen(true);
        }else if(errors.length > 0){
            seteSnackbarMessage(errors[0].message);
            seteSnackbarOpen(true);
        }
        console.log("errors", errors);
        console.log("eSnackbarOpen", eSnackbarOpen);
    }, [errors.length]);

    return (
        <section className="container">
            <div {...getRootProps({className: 'dropzone'})}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <aside style={thumbsContainer}>
                {thumbs}
                <ErrorSnackbar message={eSnackbarMessage} open={eSnackbarOpen} setOpen={seteSnackbarOpen} ></ErrorSnackbar>
            </aside>
        </section>
    );
}