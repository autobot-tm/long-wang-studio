import type { ApiResponse, QueryParams } from '../common/api.type';

export interface Fetchable {
    fetchApi<T>(url: string, params?: QueryParams): Promise<ApiResponse<T>>;
}
