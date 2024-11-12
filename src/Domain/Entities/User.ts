export class User {
    public id: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public userName: string;
    public password: string;
    public updatedAt: Date;
    public createdAt: Date;

    constructor(user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        userName: string;
        password: string;
        updatedAt: Date;
        createdAt: Date;
    }) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.userName = user.userName;
        this.password = user.password;
        this.updatedAt = user.updatedAt;
        this.createdAt = user.createdAt;
    }
}