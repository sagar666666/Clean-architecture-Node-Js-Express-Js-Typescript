import { User } from "../../Domain/Entities/User";

export interface IUserRepository{
    getUser(userName:string,password:string):Promise<User|null>;
    getUserById(id:string):Promise<User|null>;
}