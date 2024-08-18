import { IsNumber, IsString, IsArray, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  description: string;

  @IsNumber()
  stock: number;

  @IsString()
  category: string;

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  orderIds?: number[];
}
