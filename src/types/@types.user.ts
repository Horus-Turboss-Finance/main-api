declare namespace Express {
  interface Request {
    token?: string;
    user?:{
      id: number;
      mail: string;
      role: string;
    }
  }
}