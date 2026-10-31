import { Type } from 'class-transformer';
import { Allow, IsEmail, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateIntentDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  name?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.5)
  total!: number;

  @Allow()
  itemsJson!: unknown;
}
