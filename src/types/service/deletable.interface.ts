/**
 * Remove the specified resource from storage.
 *
 * @return Response
 */
export interface Deletable<T = any> {
    destroy(ids: string[], isHardDeleted?: boolean): Promise<T>;
}
