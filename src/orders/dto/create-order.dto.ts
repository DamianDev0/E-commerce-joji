import { IsNumber, IsString, IsArray, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  status: string;

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  productIds?: number[];

  @IsNumber()
  totalAmount: number;
}
