# serverless

# serverless
> ✅ Active status <br>

## About
| Name          | NUID        |
| ---           | ---         |
| Mihir Sheth  | 002743969   |

## Index
- [serverless](#serverless)
- [serverless](#serverless-1)
  - [About](#about)
  - [Index](#index)
  - [Objective](#objective)
  - [User Requirements](#user-requirements)
  - [Prerequisites](#prerequisites)

## Objective
The objective of this is to develop a serverless application that simplifies and automates the process of creating Lambda functions in AWS. This application provides a user-friendly interface for defining Lambda functions, including their code, configuration, and triggers. It also handles the deployment of Lambda functions to AWS and automate the management of their lifecycle.

## User Requirements
1. Implement Lambda Function
2. The Lambda function will be invoked by the SNS notification.
3. The Lambda function is responsible for following:
4. Download the release from the GitHub repository and store it in Google Cloud Storage Bucket.
5. Email the user the status of download.
6. Track the emails sent in DynamoDB.

## Prerequisites
- AWS Account with IAM User Access
- GitHub Account
- Google Cloud Account with Storage Access
- NodeJS Development Environment
- Basic understanding of AWS Lambda, SNS, DynamoDB, GitHub, Google Cloud Storage