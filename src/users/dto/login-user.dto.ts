import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({ message: 'email is required' })
  username: string;
  @IsNotEmpty({ message: 'password is required' })
  password: string;
}
