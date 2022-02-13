import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import FileUpload from "./components/FileUpload";

function App() {
  return (
    <div className="container" style={{ width: "600px" }}>
      <div className="my-3">
        <h3>Storyhub</h3>
        <h4>A morally decent audio database :)</h4>
        <h8>Our service will detect the audio files for profanities and remove them from the database if any</h8>
      </div>

      <FileUpload />

    </div>
  );
}

export default App;
