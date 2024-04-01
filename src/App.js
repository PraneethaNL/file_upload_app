
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import { useState } from "react";
import { nanoid } from "nanoid";

function App() {
  // Create state to store file
  const [file, setFile] = useState(null);
  const [inputText, setInputText] = useState('')
  //const [uploadStatus, setUploadStatus] = useState("idle"); // "idle", "uploading", "success", "error"


  const handleTextInputChange = (event) => {
      setInputText(event.target.value);
      };
    
// Function to handle file and store it to file state
const handleFileChange = (e) => {
  // Uploaded file
  const file = e.target.files[0];
  // Changing file state
  setFile(file);
};

  // Function to upload file to s3
  const uploadFile = async () => {
    // S3 Bucket Name
    const S3_BUCKET = "input-form";

    // S3 Region
    const REGION = "us-west-1";

      const CREDENTIALS = {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
      }

      // When no region or credentials are provided, the SDK will use the
      // region and credentials from the local AWS config.
      
      const s3Client = new S3Client({
        region: REGION,
        credentials: CREDENTIALS
    });
      //s3Client.config.credentials().then(console.log)
      // Uploading file to s3
      const command = new PutObjectCommand({
          Bucket: S3_BUCKET,
          Key: file.name,
          Body: file
      });

      try {
          const response = await s3Client.send(command);
          console.log(response);
          alert("File uploaded successfully.");
      } catch (err) {
          console.error(err);
          alert("Failed to upload file.");
      }

    //insert into dynamo via lambda
    
    const API_PATH='https://3amtuwjax4.execute-api.us-west-1.amazonaws.com/default'
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