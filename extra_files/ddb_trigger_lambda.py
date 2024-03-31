import json
import boto3


def lambda_handler(event, context):
    print("event: ", event)
    event_name=event['eventName']
    if event_name == 'INSERT':
        id=event['dynamodb']['Keys']['id']['S']
        print(id)
        ec2_client = boto3.client('ec2', region_name='us-west-1')
        print("ec2 client created")
        
        user_data = f"""
        #!/bin/bash
    
        # Install necessary dependencies (Python, AWS CLI)
        # Update packages and install pip
        sudo apt update
        sudo apt install -y python3-pip
    
        # Install boto3 using pip
        pip install boto3
        sudo apt install upzip
        
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip awscliv2.zip
        sudo ./aws/install
        
        # Download script from S3
        aws s3 cp s3://fovus-assignment/ec2_script.py output.py
        
        # Execute the script
        python3 output.py {id}
    
        # Terminate the instance after script execution
        # INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
        # aws ec2 terminate-instances --instance-ids $INSTANCE_ID --region your-region
        """
        response = ec2_client.run_instances(
            ImageId='ami-0b1eeafca2033f846',
            InstanceType='t2.micro',
            MinCount=1,
            MaxCount=1,
            UserData=user_data
            TagSpecifications=[{'ResourceType': 'instance','Tags': [{'Key': 'Name','Value': 'ec2-instance'}]}]
        )
        instance_id = response['Instances'][0]['InstanceId']
        print("Instance ID:", instance_id)
        ec2_client.terminate_instances(InstanceIds=[instance_id])
        return {
            'statusCode': 200,
            'body': json.dumps('Hello from Lambda!')
            
    }
