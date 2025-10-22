import fs from "fs";
import { 
  S3Client, PutObjectCommand,
  DeleteObjectCommand, paginateListObjectsV2, GetBucketLocationCommand,
  GetObjectCommand, CreateBucketCommand, DeleteBucketCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

async function createBucket(bucketName) {
  try {
    const s3client = new S3Client({});

    await s3client.send(
      new CreateBucketCommand({
        Bucket: bucketName
      })
    );
    console.log("bucket created successfully");
  } catch(err) {
    console.log(err);
    console.log("some error occured in creating the bucket");
  }
};

async function deleteBucket(bucketName) {
  try {
    const s3client = new S3Client({});

    const response = await s3client.send(
      new DeleteBucketCommand({ Bucket: bucketName })
    );
    console.log(response);
    console.log("bucket deletion successful");
  } catch(err) {
    console.error(err);
    console.log("could not delete the bucket");
  }
}

async function uploadImg(bucketName, fileName, filePath, fileBuffer, fileMimeType) {
  try {
    const s3client = new S3Client({});
    const fileStream = fileBuffer ? fileBuffer : fs.createReadStream(filePath);
    await s3client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: fileStream,
        ContentType: fileMimeType,
        StorageClass: 'INTELLIGENT_TIERING',
      })
    );
    console.log("image upload successful");
  } catch(err) {
    console.log(err);
    console.log("some error occured in uploading the image");
  }
}

async function deleteImg(bucketName, fileName) {
  try {
    const s3client = new S3Client({});
    await s3client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      })
    );
    console.log("image deletion successful");
  } catch(err) {
    console.log(err);
    console.log("some error occured in deleting the image");
  }
}

async function getImageUrl(bucket, key) {
  try {
    const s3client = new S3Client({});
    let command = new GetObjectCommand({
      Bucket: bucket,
      Key: key
    });
    let imgUrl = await getSignedUrl(s3client, command, { expiresIn: 3600 });
    return imgUrl;
  } catch(err) {
    console.error(err);
    console.log("error occured in getting presigned url");
  }
}

export { uploadImg, getImageUrl, deleteImg };