import AWS from "aws-sdk";

export class S3Client {
  protected client: AWS.S3;

  constructor(accessKeyId: string, secretAccessKey: string) {
    this.client = new AWS.S3({
      accessKeyId,
      secretAccessKey,
    });
  }

  public async put(
    request: AWS.S3.Types.PutObjectRequest
  ): Promise<AWS.S3.Types.PutObjectOutput> {
    return new Promise((resolve, reject) => {
      this.client.putObject(request, (error, data) => {
        if (error) {
          return reject(error);
        }

        return resolve(data);
      });
    });
  }

  public async get(
    request: AWS.S3.Types.GetObjectRequest
  ): Promise<AWS.S3.Types.GetObjectOutput> {
    return new Promise((resolve, reject) => {
      this.client.getObject(request, (error, data) => {
        if (error) {
          return reject(error);
        }

        return resolve(data);
      });
    });
  }

  public createPutPublicJsonRequest(
    location: string,
    filename: string,
    contents: string
  ) {
    const request: AWS.S3.Types.PutObjectRequest = {
      Bucket: location,
      Key: filename,
      Body: contents,
      ContentType: "application/json; charset=utf-8",
      ACL: "public-read",
      CacheControl: "max-age=60",
    };

    return request;
  }

  public createGetPublicJsonRequest(location: string, filename: string) {
    const request: AWS.S3.Types.GetObjectRequest = {
      Bucket: location,
      Key: filename,
    };

    return request;
  }
}
