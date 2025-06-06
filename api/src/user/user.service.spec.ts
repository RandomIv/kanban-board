import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from 'generated/prisma';
import { Prisma } from 'generated/prisma';
import { UserWithoutPassword } from './types/user-nopass.type';
import { UpdateUserDto } from './dtos/update-user.dto';

jest.mock('bcrypt');

const mockUserWithoutPassword: UserWithoutPassword = {
  id: '1',
  email: 'test@example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn().mockResolvedValue(mockUserWithoutPassword),
              findUnique: jest.fn().mockResolvedValue(mockUserWithoutPassword),
              findMany: jest.fn().mockResolvedValue([mockUserWithoutPassword]),
              update: jest.fn().mockResolvedValue(mockUserWithoutPassword),
              delete: jest.fn().mockResolvedValue(undefined),
            },
          },
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findMany', () => {
    it('should find many users without passwords', async () => {
      const params = {
        where: { name: { contains: 'Test' } } as Prisma.UserWhereInput,
        orderBy: { createdAt: 'desc' } as Prisma.UserOrderByWithRelationInput,
        take: 10,
        skip: 0,
      };

      const result = await userService.findMany(params);

      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        where: params.where,
        orderBy: params.orderBy,
        take: params.take,
        skip: params.skip,
        omit: { password: true },
      });
      expect(result).toEqual([mockUserWithoutPassword]);
    });
  });

  describe('update', () => {
    it('should update a user and return without password', async () => {
      const params = {
        where: { id: '1' } as Prisma.UserWhereUniqueInput,
        data: { email: 'alasdas@gmail.com' } as UpdateUserDto,
      };

      const result = await userService.update(params);

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: params.where,
        data: params.data,
        omit: { password: true },
      });
      expect(result).toEqual(mockUserWithoutPassword);
    });
  });
});
