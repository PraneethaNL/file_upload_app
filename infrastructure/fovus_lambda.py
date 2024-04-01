import json
import boto3


#To insert [id,input_text,input_file_path] to ddb.

def lambda_handler(event, context):
    dynamo=boto3.resource('dynamodb')
    table=dynamo.Table('fovus')
    print(event)
    try:
        response=table.put_item(Item=event)
    except:
        raise
    return response