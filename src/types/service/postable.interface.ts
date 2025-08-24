import type { ApiResponse } from '../common/api.type';

export interface Postable {
    postApi<T>(url: string, payload?: any): Promise<ApiResponse<T>>;
}
