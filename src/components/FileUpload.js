import React, { useState, useEffect } from "react";
import Dropzone from "react-dropzone";

import { getFiles, uploadFile } from "../services/FileUploadService";

const UploadFiles = () => {
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [currentFile, setCurrentFile] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [fileInfos, setFileInfos] = useState([]);

  useEffect(() => {
    getFiles().then((response) => {
      setFileInfos(response.data);
    });
  }, []);

  const upload = () => {
    const audioTypes = ['ogg', 'mp3', '3ga', 'aac',
                        'ac3', 'aif', 'aiff', 'alac',
                        'amr', 'ape', 'au', 'dss',
                        'flac', 'm4a', 'm4b', 'm4p',
                        'mpga', 'oga', 'mogg','wv',
                        'opus', 'qcp', 'tta', 'voc', 'wav'];

    let currentFile = selectedFiles[0];

    //ensure file is audio
    var filename = currentFile["path"];
    var fileExt = filename.split(".");
    
    // Check if file is supported (ONLY SUPPORT AUDIO FILES)
    if (audioTypes.includes(fileExt[1])) {
      
    } else {
      setMessage("File format is not supported. (Eg. '3ga', 'mp3', 'ogg', 'wav', ...)");
      return false;
    }

    setProgress(0);
    setCurrentFile(currentFile);

    console.log(currentFile);

    //run file through API
    //check if contains profanity
    //if true alert and abort
    //if false upload


    uploadFile(currentFile, (event) => {
      setProgress(Math.round((100 * event.loaded) / event.total));
      setMessage("Uploading")
    })
      .then((response) => {
        var fileURL = response.data.message;
        setMessage("Uploaded successfully!")
        return getFiles();
      })
      .then((files) => {
        setFileInfos(files.data);
      })
      .catch(() => {
        setProgress(0);
        setMessage("Could not upload the file!");
        setCurrentFile(undefined);
      });

    setSelectedFiles(undefined);
  };

  const onDrop = (files) => {
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  };

  return (
    <div>
      {currentFile && (
        <div className="progress mb-3">
          <div
            className="progress-bar progress-bar-info progress-bar-striped"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ width: progress + "%" }}
          >
            {progress}%
          </div>
        </div>
      )}

      <Dropzone onDrop={onDrop} multiple={false}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              {selectedFiles && selectedFiles[0].name ? (
                <div className="selected-file">
                  {selectedFiles && selectedFiles[0].name}
                </div>
              ) : (
                "Drag and drop file here, or click to select file (Max: 2mb)"
              )}
            </div>
            <aside className="selected-file-wrapper">
              <button
                className="btn btn-success"
                disabled={!selectedFiles}
                onClick={upload}
              >
                Upload
              </button>
            </aside>
          </section>
        )}
      </Dropzone>  
                
      <div className="alert alert-light" role="alert">
        {message}
      </div>

      {fileInfos.length > 0 && (
        <div className="card">
          <div className="card-header">Audio Database </div>
          <ul className="list-group list-group-flush">
            {fileInfos.map((file, index) => (
              <li className="list-group-item" key={index}>
                <a href={file.url}>{file.name}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadFiles;


