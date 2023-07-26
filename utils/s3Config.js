const {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const { CONFIG } = require("../constants/config");

exports.getS3Client = () => {
  const clientConfig = {
    region: CONFIG.AWS_S3_REGION,
    credentials: {
      accessKeyId: CONFIG.AWS_ACCESS_KEY,
      secretAccessKey: CONFIG.AWS_SECRET_KEY,
    },
  };

  const s3Client = new S3Client(clientConfig);

  return s3Client;
};

exports.getListObjectsCommand = (bucketName, prefix, delimiter) => {
  const listObjectsCommand = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: prefix,
    Delimiter: delimiter || "/",
  });

  return listObjectsCommand;
};

exports.getPutObjectCommand = (
  bucketName,
  key,
  body,
  contentType = "image/png",
) => {
  const putObjectCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  return putObjectCommand;
};
