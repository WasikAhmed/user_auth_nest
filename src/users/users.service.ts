import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user: User = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneById(id: number): Promise<User> {
    const user: User = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
  async loginUser(loginUserDto: LoginUserDto): Promise<User> {
    const { username, password } = loginUserDto;
    const user: User = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new NotFoundException(`User with email ${username} not found`);
    }

    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    this.userRepository.merge(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const result: DeleteResult = await this.userRepository.delete(+id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
