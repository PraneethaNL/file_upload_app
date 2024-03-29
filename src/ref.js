import { S3 } from "@aws-sdk/client-s3";
import { useState } from "react";

function App() {
  // Create state to store file
  const [file, setFile] = useState(null);

  // Function to upload file to s3
  const uploadFile = async () => {
    // S3 Bucket Name
    const S3_BUCKET = "input-form";

    // S3 Region
    const REGION = "us-west-1";

    const s3 = new S3({
      // The transformation for params is not implemented.
      // Refer to UPGRADING.md on aws-sdk-js-v3 for changes needed.
      // Please create/upvote feature request on aws-sdk-js-codemod for params.
      params: { Bucket: S3_BUCKET },

      region: REGION,

      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    // Files Parameters

    const params = {
      Bucket: S3_BUCKET,
      Key: file.name,
      Body: file,
    };

    // Uploading file to s3

    var upload = s3
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        // File uploading progress
        console.log(
          "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
        );
      })
      .promise();

    await upload.then((err, data) => {
      console.log(err);
      // File successfully uploaded
      alert("File uploaded successfully.");
    });
  };
  // Function to handle file and store it to file state
  const handleFileChange = (e) => {
    // Uploaded file
    const file = e.target.files[0];
    // Changing file state
    setFile(file);
  };
  return (
    <div className="App">
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={uploadFile}>Upload</button>
      </div>
    </div>
  );
}

export default App;