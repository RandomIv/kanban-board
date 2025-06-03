import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Prisma } from 'generated/prisma';
export class UpdateUserDto implements Prisma.UserUpdateInput {
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
