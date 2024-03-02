
export class ErrorHandler extends Error{
      httpStatusCode:Number;
      constructor(message:any,statusCode:Number){
      super(message);
      this.httpStatusCode = statusCode;
      Error.captureStackTrace(this,this.constructor)
        }        
}

// module.exports= ErrorHandler;

