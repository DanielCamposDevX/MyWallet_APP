export type ApiError = {
  message: string
  statusCode: number
}

export type ApiListResponse<T> = {
  data: T[]
}
