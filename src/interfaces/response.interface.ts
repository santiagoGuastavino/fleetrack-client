export interface IResponse<T> {
  statusCode: number;
  message: string;
  payload?: T;
  errors: IError[] | [];
}

export interface IError {
  entity?: string;
  property?: string;
  children: string[];
  constraints: object;
}

export interface IAuthPayload {
  access_token: string;
  refresh_token: string;
}
