export interface ApiResponse<T> {
  message: string;
  data: T;
  isUserFriendly: boolean;
}
