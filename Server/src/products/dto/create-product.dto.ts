import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateVariantDto {
  @IsString()
  @MinLength(1)
  sku!: string;

  @IsString()
  @MinLength(1)
  colorName!: string;

  @IsString()
  @MinLength(1)
  colorHex!: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  priceDelta?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock?: number;
}

export class CreateProductMediaDto {
  @IsString()
  @MinLength(1)
  url!: string;

  @IsOptional()
  @IsString()
  kind?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  sortOrder?: number;
}

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  slug!: string;

  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  tagline!: string;

  @IsString()
  description!: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  basePrice!: number;

  @IsObject()
  specsJson!: Record<string, unknown>;

  @IsOptional()
  @IsString()
  modelUrl?: string;

  @IsString()
  embedText!: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants?: CreateVariantDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductMediaDto)
  media?: CreateProductMediaDto[];
}
