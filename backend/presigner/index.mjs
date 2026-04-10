import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const s3 = new S3Client({});
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const handler = async (event) => {
  const { fileName, fileType } = JSON.parse(event.body || "{}");

  const command = new PutObjectCommand({
    Bucket: "image-minifier-uploads",
    Key: `uploads/${Date.now()}-${fileName}`,
    ContentType: fileType,
  });

  try {
    const uploadURL = await getSignedUrl(s3, command, { expiresIn: 300 });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ uploadURL })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
