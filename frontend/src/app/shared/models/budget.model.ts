export interface Budget {
  _id?: string;
  user?: string;
  category: string;
  limit: number;
  month: number;
  year: number;
}