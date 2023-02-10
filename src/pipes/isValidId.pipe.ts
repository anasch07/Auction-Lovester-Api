import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class isValidId implements PipeTransform {
  transform(entry: { data: string[] }, metadata: ArgumentMetadata) {
    if (metadata.type === 'param') {
      if (!mongoose.isValidObjectId(entry)) {
        throw new BadRequestException('Please enter correct id.');
      }
    }
    return entry;
  }
}
