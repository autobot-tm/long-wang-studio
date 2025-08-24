import clientApi from '@/libs/axios/instance.client';
import { ApiResponse, QueryParams } from '@/types/common/api.type';

import { BaseApiClientInterface } from '@/types/service/base-api-client.interface';
export class BaseApiClient implements BaseApiClientInterface {
    protected takeRecords = 10;

    protected endpoints = {};

    public getEndpointList() {
        return this.endpoints;
    }

    public getAPIRequestInstance() {
        return clientApi;
    }

    public async fetchApi<T>(
        url: string,
        params?: QueryParams
    ): Promise<ApiResponse<T>> {
        const res = await this.getAPIRequestInstance().get<ApiResponse<T>>(
            url,
            { params }
        );

        return res.data;
    }

    public async postApi<T>(
        url: string,
        payload?: any
    ): Promise<ApiResponse<T>> {
        const res = await this.getAPIRequestInstance().post<ApiResponse<T>>(
            url,
            payload
        );

        return res.data;
    }

    public async putApi<T>(
        url: string,
        payload?: any
    ): Promise<ApiResponse<T>> {
        const res = await this.getAPIRequestInstance().put<ApiResponse<T>>(
            url,
            payload
        );

        return res.data;
    }

    public async destroyApi<T>(
        url: string,
        ids: string[],
        isHardDeleted = false
    ): Promise<ApiResponse<T>> {
        const res = await this.getAPIRequestInstance().delete<ApiResponse<T>>(
            url,
            {
                params: { isHardDeleted },
                data: ids,
            }
        );

        return res.data;
    }

    public buildFormData<T extends Record<string, any>>(
        payload: T
    ): FormData | T {
        const form = new FormData();

        Object.entries(payload).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                form.append(
                    key,
                    value instanceof File || value instanceof Blob
                        ? value
                        : String(value)
                );
            }
        });

        return form;
    }

    public async fetchBlob(url: string, params?: QueryParams): Promise<Blob> {
        const response = await this.getAPIRequestInstance().get<Blob>(url, {
            params,
            responseType: 'blob',
        });

        return response.data;
    }
}
