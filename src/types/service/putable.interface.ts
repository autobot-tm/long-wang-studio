import type { ApiResponse } from '../common/api.type';

export interface Putable {
    putApi<T = any>(url: string, payload?: any): Promise<ApiResponse<T>>;
}
