import { IsObject, IsString, MinLength } from 'class-validator';

export class CreateConfigDto {
  @IsString()
  @MinLength(1)
  productId!: string;

  @IsObject()
  configJson!: Record<string, unknown>;
}
