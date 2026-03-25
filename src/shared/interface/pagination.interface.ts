export interface IPagination<DataType> {
  per_age: number;
  total: number;
  current_page: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
  data: DataType[];
}
