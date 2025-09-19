import { IAuth } from '../models/Auth';
import { sign, verify, SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';

export class TokenService implements IAuth{
  constructor(private readonly secret: string) {}

  generate(payload: object, expiresIn: number | StringValue = '5h'): string {
    const options: SignOptions = { expiresIn };
    return sign(payload, this.secret, options);
  }

  verify<T = any>(token: string): T {
    return verify(token, this.secret) as T;
  }
}