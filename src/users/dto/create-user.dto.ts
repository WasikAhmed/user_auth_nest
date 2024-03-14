import { IsNotEmpty, Length } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty({ message: 'username is required' })
  @Length(8, 20, {
    message: 'username must be between 8 and 20 characters long',
  })
  username: string;
  @IsNotEmpty({ message: 'email is required' })
  email: string;
  @IsNotEmpty({ message: 'password is required' })
  password: string;
}
