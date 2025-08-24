import type { QueryParams } from '../common/api.type';

export interface BlobFetchable {
    fetchBlob(url: string, params?: QueryParams): Promise<Blob>;
}
