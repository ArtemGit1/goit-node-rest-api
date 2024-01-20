const messageList = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
  };
  
  class HttpError {
    constructor(status, message = messageList[status], data = null) {
      this.status = status;
      this.message = message;
      this.data = data;
    }
  
    toJson() {
      return {
        status: this.status,
        message: this.message,
        data: this.data,
      };
    }
  }
  
  module.exports = HttpError;
  