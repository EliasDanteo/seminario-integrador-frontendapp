export interface ApiResponse<T> {
  map(arg0: (e: any) => any): unknown;
  message: string;
  data: T;
  isUserFriendly: boolean;
}
