import { injectable } from "inversify";
import { IuuidService } from "../Interfaces/IuuidService";
import { v4 as uuidv4 } from "uuid";

@injectable()
export class UUIDService implements IuuidService {
    getNewId(): string {
       return uuidv4();
    }
}