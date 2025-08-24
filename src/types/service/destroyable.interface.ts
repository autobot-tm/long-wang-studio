import type { ApiResponse } from '../common/api.type';

export interface Destroyable {
    destroyApi<T = any>(
        url: string,
        ids: string[],
        isHardDeleted?: boolean
    ): Promise<ApiResponse<T>>;
}
