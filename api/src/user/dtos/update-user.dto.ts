import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { Prisma } from 'generated/prisma';
export class UpdateUserDto implements Prisma.UserUpdateInput {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password: string;
}
