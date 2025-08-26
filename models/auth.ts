import { IUser } from "./user";

export type IAuth = Auth;

export class Auth implements IAuth {
  token: string | null;
  sessionScope: string | null;
  user: IUser | null;
  userId?: string | null;

  constructor({ token, sessionScope, user, userId }: IAuth) {
    this.token = token;
    this.sessionScope = sessionScope;
    this.user = user;
    this.userId = userId;
  }
}
