import { User } from '../../src/Domain/Entities/User';

describe('User Class', () => {

    it('should create a User instance successfully with valid data', () => {
        const userData = {
            id: '123',
            firstName: 'Sagar',
            lastName: 'Mohite',
            email: 'sagar.mohite@.com',
            userName: 'sagar.mohite',
            password: 'Sagar@12345',
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
