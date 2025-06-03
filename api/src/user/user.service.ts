import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import bcrypt from 'bcrypt';
import { UserWithoutPassword } from './types/user-nopass.type';
import { Prisma } from 'generated/prisma';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async createUser(data: CreateUserDTO): Promise<UserWithoutPassword> {
    return this.prisma.user.create({
      data: {
        ...data,
        password: await bcrypt.hash(data.password, 10),
      },
      omit: { password: true },
    });
  }
  async findOne(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<UserWithoutPassword> {
    return this.prisma.user.findUnique({
      where,
      omit: { password: true },
    });
  }
  async findMany(params: {
    where?: Prisma.UserWhereInput;
    orderBy?:
      | Prisma.UserOrderByWithRelationInput
      | Prisma.UserOrderByWithRelationInput[];
    take?: number;
    skip?: number;
  }): Promise<UserWithoutPassword[]> {
    const { where, orderBy, take, skip } = params;

    return this.prisma.user.findMany({
      where,
      orderBy,
      take,
      skip,
      omit: { password: true },
    });
  }
}
