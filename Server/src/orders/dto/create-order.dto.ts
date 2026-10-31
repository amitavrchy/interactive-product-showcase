import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsNumber, Min } from 'class-validator';

export class CreateOrderDto {
  @IsEmail()
  email!: string;

  @IsArray()
  itemsJson!: unknown[];

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  total!: number;
}
