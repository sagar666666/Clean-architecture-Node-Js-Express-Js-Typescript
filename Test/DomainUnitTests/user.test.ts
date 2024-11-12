import { User } from '../../src/Domain/Entities/User'; // Adjust the path to your User class

describe('User Class', () => {

    // Test Case 1: Valid User Creation
    it('should create a User instance successfully with valid data', () => {
        const userData = {
            id: '123',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            userName: 'johndoe',
            password: 'password123',
            updatedAt: new Date(),
            createdAt: new Date()
        };

        const user = new User(userData);

        expect(user.id).toBe(userData.id);
        expect(user.firstName).toBe(userData.firstName);
        expect(user.lastName).toBe(userData.lastName);
        expect(user.email).toBe(userData.email);
        expect(user.userName).toBe(userData.userName);
        expect(user.password).toBe(userData.password);
        expect(user.updatedAt).toBeInstanceOf(Date);
        expect(user.createdAt).toBeInstanceOf(Date);
    });

});
