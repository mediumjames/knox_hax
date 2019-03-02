#!/usr/bin/env python3
import boto3, csv

if __name__ == '__main__':
    try:
        client = boto3.client('dynamodb')
    except Exception as e:
        print(e)
    items = []
    with open('./docs/open_potholes.csv') as csv_file:
        csv_reader = csv.reader(csv_file)
        next(csv_reader)
        next(csv_reader)
        next(csv_reader)
        for row in csv_reader:
            print(row)
            for i in range(len(row)):
                if row[i] == '':
                    row[i] = '-'
            response = client.put_item(
                TableName='potholes-env',
                Item={
                    'WO_Date': {'S': row[0]},
                    'Organ': {'S': row[1]},
                    'Location': {'S': row[2]},
                    'Status': {'S': row[3]},
                    'WO_Number': {'S': row[4]},
                    'Req_Number': {'S': row[5]},
                    'Zone': {'S': row[6]},
                    'Caller': {'S': row[7]}
                }
            )