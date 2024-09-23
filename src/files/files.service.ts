import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetFileOptions } from 'src/common/interface/file.interface';
import { ASSETS_FOLDER } from 'src/common/enums/files.enum';
import { isNotEmpty } from 'class-validator';

@Injectable()
export class FilesService {
  s3Client: S3Client;
  bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>(
      'CLOUDFLARE_R2_BUCKET_NAME',
    );
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: this.configService.get<string>('CLOUDFLARE_R2_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.get<string>('CLOUDFLARE_R2_ACCESSKEY'),
        secretAccessKey: this.configService.get<string>(
          'CLOUDFLARE_R2_ACCESSKEY_SECRET',
        ),
      },
    });
  }

  async generateUploadSignedUrl(
    key: string,
    folder: Lowercase<keyof typeof ASSETS_FOLDER>,
  ) {
    try {
      if (!Object.values(ASSETS_FOLDER).includes(key as any)) {
        key = `${folder}/${key}`;
      }

      const url = await getSignedUrl(
        this.s3Client,
        new PutObjectCommand({ Bucket: this.bucketName, Key: key }),
        {
          expiresIn: 60 * 30, // expires in 30 min
        },
      );
      return url;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getFileSignedUrl(key: string, options?: GetFileOptions) {
    try {
      const url = await getSignedUrl(
        this.s3Client,
        new GetObjectCommand({ Bucket: this.bucketName, Key: key }),
        options,
      );
      return url;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  attachSignedUrl = async <T extends Record<string, any>>(
    records: T[] | T,
    fields: {
      [P in keyof T]?: P extends 'toString' ? unknown : ASSETS_FOLDER;
    },
    options: GetFileOptions,
  ) => {
    try {
      const { expiresIn = 60 * 30 } = options;
      const entityRecords: T[] = Array.isArray(records) ? records : [records];
      const entityPromises = entityRecords.map(async (item) => {
        // map over the record fields
        const fieldsPromises = Object.entries(fields).map(
          async ([entityField, fileType]) => {
            const fileName = item?.[entityField];
            if (isNotEmpty(fileName)) {
              const signedUrl = await this.getFileSignedUrl(fileName, {
                ...options,
                expiresIn,
              });
              const parts = signedUrl.split('?');
              const queryString = parts[parts.length - 1];
              item[entityField as keyof T] =
                `${fileName}?${queryString}` as any;
            }
          },
        );
        await Promise.all(fieldsPromises);
      });
      await Promise.all(entityPromises);
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
