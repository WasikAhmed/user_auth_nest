import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, Length } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ comment: 'User unique identifier' })
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  @IsNotEmpty({ message: 'username is required' })
  @Length(8, 20, {
    message: 'username must be between 8 and 20 characters long',
  })
  username: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  @IsNotEmpty({ message: 'password is required' })
  password: string;
}
