import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({});

export const handler = async (event) => {
  try {
    const { action, fileName, fileType, key } = JSON.parse(event.body || "{}");

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Content-Type": "application/json",
    };

    switch (action) {
      case "getUploadURL": {
        const fileKey = `${Date.now()}-${fileName}`;

        const command = new PutObjectCommand({
          Bucket: "image-minifier-uploads",
          Key: fileKey,
          ContentType: fileType,
        });

        const uploadURL = await getSignedUrl(s3, command, { expiresIn: 300 });

        return {
          statusCode: 200,
          headers: headers,
          body: JSON.stringify({ presignedURL: uploadURL, key: fileKey }),
        };
      }

      case "getDownloadURL": {
        if (!key) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "Missing key" }),
          };
        }

        const command = new GetObjectCommand({
          Bucket: "image-minifier-optimized",
          Key: key,
        });

        const downloadURL = await getSignedUrl(s3, command, {
          expiresIn: 3600,
        });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ presignedURL: downloadURL, key }),
        };
      }

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Invalid action" }),
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
