/**
 * Store a newly created resource in storage.
 *
 * @return Response
 */
export interface Creatable<T = any> {
    create(payload: any): Promise<T>;
}
