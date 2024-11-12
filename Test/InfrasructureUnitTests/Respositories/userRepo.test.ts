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
});
