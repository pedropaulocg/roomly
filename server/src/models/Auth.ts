export interface IAuth {
  generate(payload: object): string;
  verify<T>(token: string): T;
}

export interface TokenPayload {
  sub: string;
  role: string;
  iat?: number;
  exp?: number;
}
