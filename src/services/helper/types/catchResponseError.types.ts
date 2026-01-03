export interface ApiResponse<T> {
  status: number;
  data: null | T;
  error: ApiResponseError | null;
  meta?: ApiResponseMeta;
}

export interface ApiResponseError {
  status: number;
  source?: {
    pointer: string;
  };
  content?: ApiResponseErrorContent;
  exception?: string;
}

export interface ApiResponseErrorContent {
  status: string;
  message: string;
  statusCode: string;
  valid?: boolean;
  expired?: boolean;
  blacklisted?: boolean;
  providerCode?: string;
  statusOauth?: string;
}

export interface ApiResponseMeta {
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
  itemsPerPage?: number;
  copyright?: string;
}
