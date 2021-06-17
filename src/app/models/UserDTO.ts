export interface User {
  name: string;
  email: string;
  password: string;
  phones: { ddd: number; number: number }[];
}
