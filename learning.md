## What happens
1. Web app receives a file and asks the presingner lambda for an upload url.
2. Web app uploads the file.
3. Processor get woken up, optimizes the file and uploads it to the optimized bucket.
4. Web app keeps polling the optimized bucket until it has the file.

## How to update the code of a lambda function
aws lambda update-function-code --function-name LAMBDANAME --zip-file fileb://presigner.zip


## How to view a bucket with the aws cli
aws s3 [ls | cp | sync] bucket_url file_url (optional)

