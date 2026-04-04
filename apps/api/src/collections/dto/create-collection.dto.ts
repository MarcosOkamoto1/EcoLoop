// apps/api/src/collections/dto/create-collection.dto.ts
import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  address: string;

  @IsDateString()
  scheduledDate: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @IsString({ each: true })
  items: string[];
}
