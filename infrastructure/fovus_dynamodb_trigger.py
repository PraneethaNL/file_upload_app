import json
import boto3
import time

#trigger for whenever there is an 'INSERT' event into ddb

def lambda_handler(event, context):
    print("event: ", event)
    id=event['Records'][0]['dynamodb']['Keys']['id']['S']

    print(id)
    ec2_client = boto3.client('ec2', region_name='us-west-1')
    print("ec2 client created")
    
    user_data = f"""#!/bin/bash
    sudo yum update -y
    sudo yum install -y python3-pip python3 python3-setuptools
    pip3 install boto3
    aws s3 cp s3://fovus-assignment/ec2_script.py output.py
    python3 output.py {id}
    INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
    aws ec2 terminate-instances --instance-ids $INSTANCE_ID --region "us-west-1" 
    """
    print("started executing script")

    #EC2 instance creation
    
    response = ec2_client.run_instances(
        ImageId='ami-0b1eeafca2033f846',
        InstanceType='t2.micro',
        MinCount=1,
        MaxCount=1,
        UserData=user_data,
        KeyName='my-key-pair',
        SecurityGroupIds=['sg-07413ac5ab6903ae6'],
        IamInstanceProfile={'Arn':'arn:aws:iam::590183734485:instance-profile/s3_for_ec2'}
    )
    print(response)
    instance_id = response['Instances'][0]['InstanceId']
    print("Instance ID:", instance_id)
    
    #time.sleep(300)
    
    print("completed process")
    #ec2_client.terminate_instances(InstanceIds=[instance_id])
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
        
    }