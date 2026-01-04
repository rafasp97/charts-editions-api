import {
  IsString,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsOptional,
  IsObject,
  IsDefined,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import type { Charts } from 'src/interfaces/Charts.interface';

export class ImageDto {

  @IsString()
  color: string;

  @IsObject()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value
  )
  charts: any;
}
