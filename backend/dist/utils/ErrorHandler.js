"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.httpStatusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ErrorHandler = ErrorHandler;
// module.exports= ErrorHandler;
