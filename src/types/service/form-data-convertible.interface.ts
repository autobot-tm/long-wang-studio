export interface FormDataConvertible {
    buildFormData<T extends Record<string, any>>(payload: T): FormData | T;
}
