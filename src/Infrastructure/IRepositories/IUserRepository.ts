export interface IUserRepository{
    getUser(userName:string,password:string):Promise<any>;
    getUserById(id:string):Promise<any>;
}