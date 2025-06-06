import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { User } from '../../generated/prisma';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResponse = {
        message: 'User registered successfully',
        accessToken: 'jwt-token',
        userId: 'user-id',
      };

      mockAuthService.register.mockResolvedValue(expectedResponse);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(authService.register).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw ConflictException when email already exists', async () => {
      const registerDto: RegisterUserDto = {
        email: 'existing@example.com',
        password: 'password123',
      };

      mockAuthService.register.mockRejectedValue(
        new Error('Email already registered'),
      );

      await expect(controller.register(registerDto)).rejects.toThrow(
        'Email already registered',
      );
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const mockUser: User = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const expectedResponse = {
        message: 'User login successfully',
        accessToken: 'jwt-token',
        userId: 'user-id',
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(mockUser);

      expect(authService.login).toHaveBeenCalledWith(mockUser.id);
      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle login service errors', async () => {
      const mockUser: User = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAuthService.login.mockRejectedValue(new Error('Login failed'));

      await expect(controller.login(mockUser)).rejects.toThrow('Login failed');
      expect(authService.login).toHaveBeenCalledWith(mockUser.id);
    });
  });
});
