import { BadRequestException } from '@nestjs/common';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new BadRequestException('Only images are allowed'), false);
  }
  callback(null, true);
};

export const pdfFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(pdf)$/)) {
    return callback(new BadRequestException('Only pdfs are allowed'), false);
  }
  callback(null, true);
};
