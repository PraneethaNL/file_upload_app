
import { S3 } from "@aws-sdk/client-s3";
import { useState } from "react";
import { nanoid } from "nanoid";

function App() {
  // Create state to store file
  const [file, setFile] = useState(null);
  const [inputText, setInputText] = useState('')
  const [uploadStatus, setUploadStatus] = useState("idle"); // "idle", "uploading", "success", "error"


  const handleTextInputChange = (event) => {
      setInputText(event.target.value);
      };
    

  // Function to upload file to s3
  const uploadFile = async () => {
    // S3 Bucket Name
    const S3_BUCKET = "input-form";

    // S3 Region
    const REGION = "us-west-1";

    //gateway end point to access lambda
    
    const s3 = new S3({
      // The transformation for params is not implemented.
      // Refer to UPGRADING.md on aws-sdk-js-v3 for changes needed.
      // Please create/upvote feature request on aws-sdk-js-codemod for params.
      params: { Bucket: S3_BUCKET },
      region: REGION,

      credentials: {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      },
    });

    // Files Parameters

    const params = {
      Bucket: S3_BUCKET,
      Key: file.name,
      Body: file,
    };

    // Uploading file to s3

    //this  one line works too

    try {
      const data = await s3.putObject(params);
      console.log(data); // This will log the response from S3
      alert("File uploaded successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to upload file!");
    }

    // await s3.putObject(params).promise().then((err, data) => {
    //     console.log(err);
    //     // Fille successfully uploaded
    //     alert("File uploaded successfully.");
    //   });

    // var upload = s3
    // .putObject(params)
    // .on("httpUploadProgress", (evt) => {
    //   // File uploading progress
    //   console.log(
    //     "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
    //   );
    // })
    // .promise();

    // await upload.then((err, data) => {
    //   console.log(err);
    //   // File successfully uploaded
    //   alert("File uploaded successfully.");
    // });
    
    // insert into dynamo via lambda
    const API_PATH='https://ckaxti9hn8.execute-api.us-west-1.amazonaws.com'
    const dynamoDbData = {
      id: nanoid(),
      input_text: inputText,
      input_file_path: `${S3_BUCKET}/${file.name}`,
    };

    const response = await fetch(API_PATH, {
      method: "POST",
      headers: {
        "Content-Type":"application/json",
      },
      body: JSON.stringify(dynamoDbData),
    });

    if (!response.ok) {
      throw new Error("Failed to save data to DynamoDB");
    }
    alert("File uploaded and data saved successfully!");
    
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
      <label htmlFor="inputText">Text input:</label>
      <input
        type="text"
        id="inputText"
        placeholder='enter text'
        value={inputText}
        onChange={handleTextInputChange}
      />
      <br />
      <label htmlFor="fileInput">File input:</label>
        <input type="file"
        id="fileInput"
        accept=".txt"
         onChange={handleFileChange} />
         <br />
        <button type="submit" onClick={uploadFile}>Upload</button>
      </div>
    </div>
  );
}

export default App;