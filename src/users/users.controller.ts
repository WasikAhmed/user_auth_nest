import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  @UsePipes(new ValidationPipe())
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    try {
      const user = await this.usersService.loginUser(loginUserDto);

      return {
        message: 'Login successful',
        user: user,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          message: 'User not found',
        };
      } else if (error instanceof UnauthorizedException) {
        return {
          message: 'Invalid credentials',
        };
      } else {
        return {
          message: 'An error occurred',
          error: error.message,
        };
      }
    }
  }

  @Get('/')
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOneById(+id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.usersService.remove(+id);
  }
}
