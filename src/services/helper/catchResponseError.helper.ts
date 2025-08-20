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
    authors?: string[];
}



const isExceptionWithMessage = (
    exception: unknown,
): exception is { content: { message: string } } => {
    if (
        typeof exception === 'object' &&
        exception &&
        'content' in exception &&
        exception.content &&
        typeof exception.content === 'object' &&
        'message' in exception.content &&
        typeof exception.content.message === 'string'
    ) {
        return true;
    }

    return false;
};


export const catchResponseError = (error: ApiResponseError | null) => {
    if (error?.content?.message) {
        return error.content.message;
    }

    if (isExceptionWithMessage(error?.exception)) {
        return error.exception.content.message;
    }
};
