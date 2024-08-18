import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async create(@Body() registerDto: RegisterDto) {
    console.log('Received Register Request:', registerDto);
    const newUser = await this.authService.register(registerDto);
    console.log('User Created:', newUser);
    return {
      status: HttpStatus.CREATED,
      message: 'User created successfully',
      user: newUser,
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log('Received Login Request:', loginDto);
    const user = await this.authService.login(loginDto);
    console.log('Login Successful:', user);
    return {
      status: HttpStatus.OK,
      message: 'Login successful',
      user: user,
    };
  }
}
