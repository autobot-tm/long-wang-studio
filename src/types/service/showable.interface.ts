import type { QueryParams } from '../common/api.type';

/**
 * Display the specified resource.
 *
 * @param  int  $id
 * @return \Illuminate\Http\Response
 */
export interface Showable<T = any> {
    detail(id: string, params?: QueryParams): Promise<T>;
}
