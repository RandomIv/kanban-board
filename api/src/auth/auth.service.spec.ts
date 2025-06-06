import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { User } from '../../generated/prisma';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto: RegisterUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockCreatedUser: User = {
      id: 'user-id',
      email: 'test@example.com',
      password: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should register a new user successfully', async () => {
      mockUserService.findOne.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue(mockCreatedUser);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.register(registerDto);

      expect(userService.findOne).toHaveBeenCalledWith({
        email: registerDto.email,
      });
      expect(userService.create).toHaveBeenCalledWith(registerDto);
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: mockCreatedUser.id });
      expect(result).toEqual({
        message: 'User registered successfully',
        accessToken: 'jwt-token',
        userId: mockCreatedUser.id,
      });
    });

    it('should throw ConflictException when user already exists', async () => {
      mockUserService.findOne.mockResolvedValue(mockCreatedUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.register(registerDto)).rejects.toThrow(
        'Email already registered',
      );

      expect(userService.findOne).toHaveBeenCalledWith({
        email: registerDto.email,
      });
      expect(userService.create).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('verifyUser', () => {
    const email = 'test@example.com';
    const password = 'password123';
    const hashedPassword = 'hashed-password';

    const mockUser: User = {
      id: 'user-id',
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should verify user with valid credentials', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.verifyUser(email, password);

      expect(userService.findOne).toHaveBeenCalledWith(
        { email },
        { includePassword: true },
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockUserService.findOne.mockResolvedValue(null);

      await expect(service.verifyUser(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.verifyUser(email, password)).rejects.toThrow(
        'Invalid credentials',
      );

      expect(userService.findOne).toHaveBeenCalledWith(
        { email },
        { includePassword: true },
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      await expect(service.verifyUser(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.verifyUser(email, password)).rejects.toThrow(
        'Invalid credentials',
      );

      expect(userService.findOne).toHaveBeenCalledWith(
        { email },
        { includePassword: true },
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });
  });

  describe('login', () => {
    const userId = 'user-id';

    it('should login user successfully', async () => {
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(userId);

      expect(jwtService.sign).toHaveBeenCalledWith({ sub: userId });
      expect(result).toEqual({
        message: 'User login successfully',
        accessToken: 'jwt-token',
        userId,
      });
    });

    it('should handle JWT service errors', async () => {
      mockJwtService.sign.mockImplementation(() => {
        throw new Error('JWT signing failed');
      });

      await expect(service.login(userId)).rejects.toThrow('JWT signing failed');
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: userId });
    });
  });
});
