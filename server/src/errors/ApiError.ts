export class ApiError extends Error {
    public status: number;

    constructor(statuts: number, message: string) {
        super(message);
        this.status = statuts;
    };

    public static badRequest(msg: string): ApiError {
        return new ApiError(400, msg);
    };

    static unauthorized(msg: string = "Unauthorized"): ApiError {
        return new ApiError(401, msg);
    };

    static forbidden(msg: string = "Forbidden"): ApiError {
        return new ApiError(403, msg);
    };

    static notfound(msg: string = "Not Found"): ApiError {
        return new ApiError(404, msg);
    };

    static internal(msg: string = "Internal Server Error"): ApiError {
        return new ApiError(500, msg);
    };

    static serviceUnavailable(msg: string = "Service Unavailable"): ApiError {
        // For example: when Google OAuth is down
        return new ApiError(503, msg);
    };

    static tooManyRequests(msg: string = "Too Many Requests"): ApiError {
        return new ApiError(429, msg);
    }
};