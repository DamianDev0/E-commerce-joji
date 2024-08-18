import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorator/auth.decorator';
import { Role } from '../common/enum/roles.enum';

@ApiTags('products')
@ApiBearerAuth()
@Auth(Role.ADMIN)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  async create(@Body() createProductDto: CreateProductDto) {
    const newProduct = await this.productsService.create(createProductDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Product created successfully.',
      product: newProduct,
    };
  }

  @Get()
  async findAll() {
    const allProducts = await this.productsService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'All products retrieved successfully.',
      products: allProducts,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const updatedProduct = await this.productsService.update(
      id,
      updateProductDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Product updated successfully.',
      product: updatedProduct,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deletedProduct = await this.productsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Product deleted successfully.',
      product: deletedProduct,
    };
  }
}
