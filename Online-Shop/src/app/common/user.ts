import { Address } from "./address";
import { UserInfo } from "./user-info";

export class User {
  public userId: number = -1;
  public userName: string = '';
  public password: string = '';
  public userInfo: UserInfo = new UserInfo();
  public addresses: Address[] = [];
  public authStatus: string = '';
  constructor() { }
}
