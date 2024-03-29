
npm install aws-sdk-js-v3 - did not work for me, so tried below command
 
$ npm install @aws-sdk/client-s3   
$npm install @aws-sdk/core    


AWS creds:

1. create a .env file in the folder where package.json is present.
2. copy the accesskey,secret_access_key into the .env
    note: should use REACT_APP prefix for both vars, don't wrap values in quotes.