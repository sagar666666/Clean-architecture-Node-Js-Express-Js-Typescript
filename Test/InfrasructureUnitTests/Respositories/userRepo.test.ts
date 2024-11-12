import { UserRepository } from '../../../src/Infrastructure/Repositories/userRepository';
import { PrismaClient, User as PrismaUser } from '@prisma/client';
import { User } from '../../../src/Domain/Entities/User';

// Mocking the PrismaClient
jest.mock('@prisma/client', () => {
    const mockPrisma = {
        user: {
            create: jest.fn(),
            update: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            findFirst: jest.fn(),
        },
    };

    return {
        PrismaClient: jest.fn(() => mockPrisma),
    };
});

describe('UserRepository', () => {

    let userRepository: UserRepository;
    let prismaMock: any;

    beforeEach(() => {
        prismaMock = new PrismaClient();
        userRepository = new UserRepository();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getUserById', () => {
        it('should return user when user is found', async () => {

            const mockUser = {
                id: '123',
                firstName: 'Sagar',
                lastName: 'Mohite',
                email: 'sagar.mohite@gmail.com',
                userName: 'u6ic_sam',
                password: 'KingOfhearts@4147',
                updatedAt: new Date(),
                createdAt: new Date(),
            };

            prismaMock.user.findUnique.mockResolvedValue(mockUser);

            const user = await userRepository.getUserById('123');

            expect(user).toBeInstanceOf(User);
            expect(user?.id).toBe('123');
            expect(user?.firstName).toBe('Sagar');
            expect(user?.lastName).toBe('Mohite');
        });

        it('should return null when no user is found', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);
            const user = await userRepository.getUserById('123');
            expect(user).toBeNull();
        });
    });

    describe('getUser', () => {
        it('should return user when valid userName and password are provided', async () => {
            const mockUser = {
                id: '123',
                firstName: 'Sagar',
                lastName: 'Mohite',
                email: 'sagar.mohite@gmail.com',
                userName: 'u6ic_sam',
                password: 'KingOfhearts@4147',
                updatedAt: new Date(),
                createdAt: new Date(),
            };

            prismaMock.user.findFirst.mockResolvedValue(mockUser);
            const user = await userRepository.getUser('u6ic_sam', 'KingOfhearts@4147');
            expect(user).toBeInstanceOf(User);
            expect(user.userName).toBe('u6ic_sam');
        });

        it('should return null when userName or password is incorrect', async () => {
            prismaMock.user.findFirst.mockResolvedValue(null);
            const user = await userRepository.getUser('vivek', 'vk@123');
            expect(user).toBeNull();
        });
    });

    describe('UserRepository', () => {
        it('should add a user successfully', async () => {
          // Arrange
            const user = new User({
                id: '3F9C1D58-47F4-4F38-9C3A-96174613B20F',
                firstName: 'Sagar',
                lastName: 'Mohite',
                email: 'mohitesagar12.com',
                password: 'Test@123',
                userName: 'sagar.mohite',
                createdAt: new Date('2023-12-08 11:57:08.8670000'),
                updatedAt: new Date('2023-12-08 11:57:08.8670000')
            });

          const prismaUserResponse = {
            id: '3F9C1D58-47F4-4F38-9C3A-96174613B20F',
            firstName: 'Sagar',
            lastName:'Mohite',
            email: 'mohitesagar12.com',
            password:'Test@123',
            userName:'sagar.mohite',
            createdAt:new Date('2023-12-08 11:57:08.8670000'),
            updatedAt: new Date('2023-12-08 11:57:08.8670000')
          };
      
          // Mock Prisma's user.create to return a mocked user object
          prismaMock.user.create.mockResolvedValue(prismaUserResponse);
      
          // Act
          const result = await userRepository.addUser(user);
      
          // Assert
          expect(prismaMock.user.create).toHaveBeenCalledWith({
            data: {
              id: user.id,
              firstName: user.firstName,
              email: user.email,
              userName:user.userName,
              lastName:user.lastName,
              password:user.password,
              createdAt:user.createdAt,
              updatedAt:user.updatedAt
            },
          });
          expect(new User(result)).toBeInstanceOf(User);
          expect(result.id).toBe(prismaUserResponse.id);
          expect(result.firstName).toBe(prismaUserResponse.firstName);
          expect(result.email).toBe(prismaUserResponse.email);
        });
      
        it('should throw an error if user creation fails', async () => {
          // Arrange
          const user = new User({ id: '',
          firstName: 'Sagar',
          lastName:'Mohite',
          email: 'mohitesagar12.com',
          password:'Test@123',
          userName:'sagar.mohite',
          createdAt:new Date('2023-12-08 11:57:08.8670000'),
          updatedAt: new Date('2023-12-08 11:57:08.8670000')});
          prismaMock.user.create.mockRejectedValue(new Error('User creation failed'));
      
          // Act & Assert
          await expect(userRepository.addUser(user)).rejects.toThrow('User creation failed');
        });
    });
});
