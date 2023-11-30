import axios from 'axios';
import { Storage } from '@google-cloud/storage';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import AWS from 'aws-sdk';

const mailgun = new Mailgun(formData);
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const storage = new Storage({
    credentials: JSON.parse(process.env.SERVICE_KEY)
});

export const handler = async (event) => {
    // Log the event object for debugging
    const message = JSON.parse(event.Records[0].Sns.Message);
    console.log("Event: ", message);

    const GOOGLE_BUCKET = process.env.GOOGLE_STORAGE_BUCKET_NAME;
    const assignmentId = message.assignment_id;
    const no_of_attempts = message.num_attempts;
    const url = message.url;

    const fileIdentifier = url.substring(url.lastIndexOf('/') + 1);
    const filePath = "Assignment-" + assignmentId + "/" + message.mail_id + "/" + no_of_attempts + "/" + fileIdentifier;

    try {
        const cloudBucket = storage.bucket(GOOGLE_BUCKET);
        const file = cloudBucket.file(filePath);
        const fileComm = await downloadFile(url);
        await file.save(fileComm);
        console.log("uploaded successfully");
        const htmlMail = `<p>Assignment: ${message.assignmentName}, Attempt: ${message.num_attempts} was uploaded successfully.</p>${filePath}`;
        const value = await sendMail(message.mail_id, `Upload success for ${message.assignmentName}`, htmlMail);
        console.log(value);
        await trackEmail("01", message.mail_id, htmlMail);
    } catch (error) {
        console.log("Cannot download", error);
        const htmlMail = `<p>Submission Failed: ${message.assignmentName}. File not downloaded.</p>`;
        const value = await sendMail(message.mail_id, `Upload failed ${message.assignmentName}`, htmlMail);
        console.log(value);
        await trackEmail("02", message.mail_id, htmlMail);
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};

async function downloadFile(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
}

async function sendMail(to, subject, html) {
    const mg = mailgun.client({ username: 'api', key: process.env.MG_KEY });
    try {
        const value = await mg.messages.create(process.env.DNS_NAME, {
            from: `Webapp app <webapp@${process.env.DNS_NAME}>`,
            to: [to],
            subject: subject,
            html: html
        });
        return value;
    } catch (err) {
        console.log(err);
    }
}

async function trackEmail(message_id,to,message_body){
    const params = {
        TableName: process.env.DB_TABLE_NAME,
        Item: {
            id: message_id,
            email: to,
            message_body: message_body,
            timestamp: new Date().toISOString(),
        },
    };
    
    try {
        await dynamoDB.put(params).promise();
        console.log(`Email tracked for ${to}`);
    } catch (err) {
        console.error(`Error tracking email: ${err}`);
    }
}

