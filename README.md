###SETUP:

Install Node version manager(nvm) from nvm-github

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

Install required node version

nvm install 20 --lts -- This installs npm, npx
Install node packages

npm install aws-sdk-js-v3 - did not work for me, so I tried below command
 
$npm install @aws-sdk/client-s3   
$npm install @aws-sdk/core    


cd myapp and npm install

Install aws cli

  curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
  sudo installer -pkg AWSCLIV2.pkg -target /
Reference: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html


###Configure aws cli by running:

$aws configure 
    and add accessKey and secretAccessKey
    Create an aws user

###AWS:

You need to create your aws account and login into it:

    Create the following services:

        s3 bucket:
           1. name : 'input-form', region :"us-west-1"
            block: on
            policy : see s3_ploicy.txt file in extra_files folder.

            follow the default steps

            2. create one more bucket:
                name: fovus-assignment

                upload ec2_script.py from extra_files folder into this separate bucket.
        IAM:
            goto IAM service and create 
        
        Lambda:
            create two lambda functions:
                1.fovus-lambda : to put_item into ddb (copy from put_lambda.py from extra_files folder attached).

                2. fovus-dynamodb-trigger : copy the file from ddb_trigger_lambda.py

        
        API Gateway:

            1.create API -> REST API -> New API , give a name
            2.Create Method -> 'POST' as method type -> Lambda Function -> choose the lambda function created above (fovus-lambda).
            3. **Enbale CORS.



        dynamoDB:

            1.create a table with name: 'fovus'. partition key : 'id'
            2.click on the table and from 'exports and streams' section
                goto streams and turn it on.

            3.Below it is the trigger -> create a trigger
             and then choose : fovus-dynamodb-trigger lambda function -> create trigger.






###Run the npm app:

cd myapp && replace App.js with my App.js present in email/git.




##AWS creds:

#for some reason process.env was not fetching credentials from my 
./aws/credentials folder.
So, I created the .env myself.

1. create a .env file in the folder where package.json is present.
2. copy the accesskey,secret_access_key into the .env
    




##Trigger and EC2 instance:

turn on streams - from exports and streams in dynamo table - fovus
create a trigger:
    1.copy paste the trigger.py
    2.create an ec2 instance
    3.run the scrpit - by passing user_data
        the script is present in a s3 bucket - fovus-assignment (you need to create a separate bucket and store the output.py file in it)
    4.

    