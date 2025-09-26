export interface CustomRequest extends Request {
  token?: string;
  user?:{
    id: number;
    mail: string;
    role: string;
  }
}