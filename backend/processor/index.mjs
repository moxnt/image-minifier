import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

const s3 = new S3Client({});

export const handler = async (event) => {
  const record = event.Records[0];
  const srcBucket = record.s3.bucket.name;
  const srcKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
  const destBucket = "image-minifier-optimized";
  const destKey = `optimized/${srcKey.split('/').pop().replace(/\.[^/.]+$/, "")}.webp`;

  try {
    const getCommand = new GetObjectCommand({ Bucket: srcBucket, Key: srcKey });
    const response = await s3.send(getCommand);

    const bytes = await response.Body.transformToByteArray();
    const inputBuffer = Buffer.from(bytes);

    const outputBuffer = await sharp(inputBuffer)
      .resize({ width: 1200, withoutEnlargement: true }) // Responsive Resize
      .webp({ quality: 80 })                             // Convert to WebP
      .toBuffer();

    await s3.send(new PutObjectCommand({
      Bucket: destBucket,
      Key: destKey,
      Body: outputBuffer,
      ContentType: "image/webp"
    }));

    console.log(`Successfully optimized ${srcKey} -> ${destKey}`);
    return { status: "success" };

  } catch (error) {
    console.error("Transformation failed:", error);
    throw error; // Let Lambda retry if it's a transient error
  }
};

