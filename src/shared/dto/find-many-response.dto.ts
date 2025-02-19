export interface FindManyResponseDTO<T> {
  totalCount: number;
  data: T[];
  page: number;
  pageSize: number;
}
