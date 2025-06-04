import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Prisma } from 'generated/prisma';
export class RegisterUserDto implements Prisma.UserCreateInput {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
