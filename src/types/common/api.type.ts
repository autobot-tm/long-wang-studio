import { isAxiosError } from 'axios';

import clientApi from '@/libs/axios/instance.client';

export interface ApiRequest {
    searchTerm?: string;
    isDeleted?: boolean;
    takeCount?: number;
    skipCount?: number;
    sortBy?: string;
    includeProperties?: string;
    fromDate?: Date;
    toDate?: Date;
    fromTime?: Date;
    toTime?: Date;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    statusCode: number;
    result: T;
}

export interface PaginatedResult<T> {
    items: T[];
    totalCount: number;
}

export type QueryParams = Record<string, string | number | boolean | Date>;

// Error handling
export interface ApiError {
    code?: number;
    message: string;
    status?: number;
}

export const unwrapError = (error: unknown): ApiError => {
    if (isAxiosError(error)) {
        const rawError = error.response?.data?.error ?? error.response?.data;

        return {
            code: rawError?.code,
            message: rawError?.message || 'An unknown error occurred.',
            status: error.response?.status,
        };
    }

    return {
        message: 'An unexpected error occurred.',
    };
};

// Generic fetcher (client-side)
export async function fetchApi<T>(
    url: string,
    params?: QueryParams
): Promise<ApiResponse<T>> {
    const res = await clientApi.get<ApiResponse<T>>(url, { params });

    return res.data;
}

export type HttpMethod = 'post' | 'put' | 'delete';

export async function mutateApi<Req, Res>(
    method: HttpMethod,
    url: string,
    data?: Req,
    params?: Record<string, unknown>
): Promise<Res> {
    const res = await clientApi.request<ApiResponse<Res>>({
        method,
        url,
        data,
        params,
    });

    return res.data.result;
}

export interface PageInfo {
    hasNextPage: boolean;
}
