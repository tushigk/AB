
export type IUser = User;

export class User implements IUser {
  username: string;
  role: string;
  createdAt: Date;
  _id: string;
  tokens:number;
  userRequestCount: number;
  doctorAnsweredUserCount: number;

  constructor({ _id,  createdAt, username,role, tokens, userRequestCount, doctorAnsweredUserCount }: IUser) {
    this._id = _id;
    this.username = username;
    this.role = role;
    this.createdAt = createdAt;
    this.tokens = tokens;
    this.userRequestCount = userRequestCount;
    this.doctorAnsweredUserCount = doctorAnsweredUserCount;
  }

  static fromJson(json: any) {
    return new User(json);
  }
}
