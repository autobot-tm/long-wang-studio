import type { QueryParams } from '../common/api.type';

/**
 * Display a listing of the resource.
 *
 * @return Response
 */
export interface Indexable<T = any> {
    index(params?: QueryParams): Promise<T>;
}
