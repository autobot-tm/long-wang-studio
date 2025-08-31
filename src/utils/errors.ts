export class AppError extends Error {
    code: string;
    details?: any;
    constructor(code: string, message?: string, details?: any) {
        super(message || code);
        this.code = code;
        this.details = details;
    }
}
