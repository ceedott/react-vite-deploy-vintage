import { ChangeEvent, useState } from "react";
import axios from 'axios';


function FileUploader() {
    const [file, setFile] = useState(null)
    const [status, setStatus] = useState("idle")
    const [uploadProgress, setUploadProgress] = useState(0)

    function handleFileChange(e) {
        if (e.target.files) {
            setFile(e.target.files[0])
        }
    }

    // function is async bc we deal with API's which are asynchronous in nature
    async function handleFileUpload() {
        if (!file) return;

        setStatus("uploading")
        setUploadProgress(0)

        const formData = new FormData() // what is FormData ????
        formData.append("file", file) // this is what we send to backend

        try {
            const modelResult = await axios.post("http://127.0.0.1:8000/predict", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (ProgressEvent) => {
                    const progress = ProgressEvent.total 
                        ? Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total)
                        : 0;
                    setUploadProgress(progress)
                }
            });

            setStatus("success") // FIXME: shouldnt stay on success, switch to idle somewhere after bc its printing "File upload successful when it shouldnt"
            setUploadProgress(100)
            console.log(modelResult.data.prediction)

        } catch {
            setStatus("error")
            setUploadProgress(0)
        }

    }

    return (
        <div>
            <input type="file" onChange={handleFileChange}/>

            {status == "uploading" && <p>{uploadProgress}</p>}

            {file && status !== "uploading" && (
                <button className="upload-button" onClick={handleFileUpload}>Upload</button>
            )}

            {status == "success" && console.log("File Upload Successful")}
        </div>
    );
}

export default FileUploader;