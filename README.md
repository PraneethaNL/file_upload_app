### SETUP:

*   Install Node version manager(nvm) from nvm-github
    *   `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash`

* Install required node version
    *   `nvm install 20 --lts` -- This installs npm, npx

*   Clone this repo
    * `git clone https://github.com/PraneethaNL/fovus-assignment.git`

*   Install node packages:
    *   `cd myapp`
    *   `npm install`

*   Install aws cli

    * `curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
  sudo installer -pkg AWSCLIV2.pkg -target /`

    * Reference: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

    


### AWS:

*   Create aws account and login into it.
    * create a user from IAM service with `administrator access` and store the accesskeyID,secretAccesskey.
    * configure aws cli
        *  `$aws configure`, and add accessKey and secretAccessKey

*   Create the following services:

    * s3 bucket : Create two buckets with following config

           1.   name : 'input-form', 
                region :"us-west-1"
                block: on
                policy : see s3_ploicy.txt file in infrastructure folder.

            Note:This is for uploading files from the form/browser.

            2.  name: fovus-assignment
                region :"us-west-1"
                block: on
            Note:  upload ec2_script.py from 'infrastructure' folder into this bucket.This holds script to be run on ec2 instance.
    *   IAM:
        *   goto [IAM Service](https://us-east-1.console.aws.amazon.com/iam/home?region=us-west-1#/home).
            Create a role - `s3_for_ec2` and add these permissions `AmazonS3FullAccess,AmazonEC2FullAccess,AmazonDynamoDBFullAccess`

        *   Note: This role is used as the instanceprofile for ec2 instance. Copy the 'arn' and add it as the `IamInstanceProfile` parameter for `ec2.run_instances()` method.
        
    *   Lambda: Create two lambda functions with following config

                1.Name: fovus-lambda

                  Description: This will be invoked from the API gateway service when a file is uploaded.This inserts(put_item) into ddb.
                  Location: ./infrastructure/fovus_lambda.py

                2.Name : fovus-dynamodb-trigger

                  Description: This will be the trigger for dynamoDB when a new item is inserted.
                  Location: ./infrastructure/fovus_dynamodb_trigger.py
                  Note: Add 'IAMfullaccess' for the role associated with this lambda. This is required for lambda to read the instance-profile role.
        
    *   API Gateway:

            1.Create API -> REST API -> New API , give a name eg: fovus-rest-post
            2.Create Method -> 'POST' as method type -> Lambda Function -> choose the lambda function created above (fovus-lambda).
            IMP NOTE: Enbale CORS.
            3. Click on deployAPI and choose a stage name.
            4. goto stages from the left side panel and copy the invoke URL.

            NOTE: This will be the API_PATH for the gateway (present in App.js).



    *   dynamoDB:

            1.create a table with name: 'fovus', partition key : 'id'

            2.Enable streams: click on the table 'fovus' and from 'exports and streams' section goto dynamoDB stream details and turn it on.

            3.Create a trigger: Can find this option below streams

            create a trigger -> then choose : fovus-dynamodb-trigger lambda function -> create trigger.

            IMP : Edit the trigger criteria to invoke trigger based on 'INSERT' event only.This saves unnecessary lambda hits.

                a. goto Lambda ->Functions ->fovus_dynamodb_trigger ->Edit trigger ->additional settings
                b. add this in the trigger criteria :  { "eventName": ["INSERT"]}



### Run the npm app:

`$cd myapp`

`$npm start`




## AWS creds:

1. create a .env file in the folder where package.json is present.
2. copy the accesskey,secret_access_key into the .env
3. add .env file to .gitignore



## References:

SDK Examples

*   https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html

*   https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/introduction/

DynamoDB

*   Event filtering
    *   https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.Lambda.Tutorial2.html

    *   https://repost.aws/questions/QUpeoP1XJmSrCmgAVrrufFKw/lambda-event-filtering-for-dynamodb-event-name-insert-not-working

*   get-item

    *   https://awscli.amazonaws.com/v2/documentation/api/latest/reference/dynamodb/get-item.html

        `aws dynamodb get-item --table-name fovus --key '{"id": {"S":"1"}}'`

*   put-item
    *   https://awscli.amazonaws.com/v2/documentation/api/latest/reference/dynamodb/put-item.html

    *   https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/getting-started-step-2.html

        `aws dynamodb put-item --table-name fovus --item \ '{"id":{"S": "1"}, "input_text": {"S": "ip_txt"}, "input_file_path": {"S": "s3://input-form/hr.txt"} }'`

Enable CORS

*   https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html

EC2
*   Key-pair: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/create-key-pairs.html

    