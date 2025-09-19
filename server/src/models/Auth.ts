export interface IAuth {
  generate(payload: object): string;
  verify<T>(token: string): T;
}