import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { UserActiveInterface } from '../common/interfaces/activate-user.interface';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly productService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: UserActiveInterface) {
    const products = await this.productService.findProducts(
      createOrderDto.productIds,
    );
    if (products.length !== createOrderDto.productIds.length) {
      throw new NotFoundException('One or more products not found');
    }

    return await this.orderRepository.save({
      ...createOrderDto,
      userEmail: user.email,
      userId: user.id,
    });
  }
  async findAll(user: UserActiveInterface) {
    return this.orderRepository.find({
      where: { userEmail: user.email },
    });
  }

  async findOne(id: number, user: UserActiveInterface) {
    const order = await this.orderRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    if (user.role !== 'USER' && order.userEmail !== user.email) {
      throw new ForbiddenException('Access denied');
    }
    return order;
  }

  async update(
    id: number,
    updateOrderDto: UpdateOrderDto,
    user: UserActiveInterface,
  ) {
    const order = await this.orderRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    if (user.role !== 'USER' && order.userEmail !== user.email) {
      throw new ForbiddenException('Access denied');
    }
    return this.orderRepository.update(id, updateOrderDto);
  }

  async remove(id: number, user: UserActiveInterface) {
    const order = await this.orderRepository.findOne({
      where: { id },
    });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    if (user.role !== 'USER' && order.userEmail !== user.email) {
      throw new ForbiddenException('Access denied');
    }

    return this.orderRepository.delete(id);
  }
}
