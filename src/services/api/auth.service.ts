import type { AuthPayload, AuthResponse } from '@/types/app/auth.type';
import type {
    ApiResponse,
    PaginatedResult,
    QueryParams,
} from '@/types/common/api.type';
import type { BaseApiClientInterface } from '@/types/service/base-api-client.interface';
import type { Creatable } from '@/types/service/creatable.interface';
import type { Deletable } from '@/types/service/deletable.interface';
import type { Indexable } from '@/types/service/indexable.interface';
import type { Showable } from '@/types/service/showable.interface';
import type { Updatable } from '@/types/service/updatable.interface';

type AuthListResponse = ApiResponse<PaginatedResult<AuthResponse>>;

export class AuthService
    implements Showable, Updatable, Deletable, Creatable, Indexable
{
    public constructor(private apiClient: BaseApiClientInterface) {}

    //TODO: update endpoints
    public endpoints = {
        base: () => '/api/Auth',
        detail: (id: string) => `/api/Auth/${id}`,
    };

    public index(params?: QueryParams): Promise<AuthListResponse> {
        return this.apiClient.fetchApi(this.endpoints.base(), params);
    }

    public detail(
        id: string,
        params?: QueryParams
    ): Promise<ApiResponse<AuthResponse>> {
        return this.apiClient.fetchApi(this.endpoints.detail(id), params);
    }

    public create(payload: AuthPayload): Promise<ApiResponse<AuthResponse>> {
        return this.apiClient.postApi(this.endpoints.base(), payload);
    }

    public update(
        id: string,
        payload: AuthPayload
    ): Promise<ApiResponse<AuthResponse>> {
        return this.apiClient.putApi(this.endpoints.detail(id), payload);
    }

    public destroy(
        ids: string[],
        isHardDeleted: boolean = false
    ): Promise<ApiResponse<void>> {
        return this.apiClient.destroyApi(
            this.endpoints.base(),
            ids,
            isHardDeleted
        );
    }
}
