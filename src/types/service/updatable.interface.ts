/**
 * Update the specified resource in storage.
 *
 * @return Response
 */
export interface Updatable<T = any> {
    update(id: string, payload?: any): Promise<T>;
}
