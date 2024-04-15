import {
  PrismaClientRustPanicError,
  PrismaClientValidationError,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientInitializationError,
} from "@prisma/client/runtime/library";

export function handlePrismaError(error: unknown) {
  let errMsgLong, errMsgShort: string;

  // Query engine returns a known error related to the request
  if (error instanceof PrismaClientKnownRequestError) {
    // Handling specific known request errors
    errMsgLong = `Error Code: ${error.code}, Meta Info: ${JSON.stringify(error.meta)}, Message: ${error.message}`;
    errMsgShort = "There was a problem with your request.";
    switch (error.code) {
      // P2002 -> Unique constraint violation
      case "P2002":
        errMsgShort = "This item already exists.";
        break;

      // P2003 -> Foreign key constraint violation
      case "P2003":
        errMsgShort = "This operation violates a foreign key constraint.";
        break;

      // P2016 -> Record not found
      case "P2016":
        errMsgShort = "The requested item could not be found.";
        break;

      default:
        errMsgShort = "An error occurred.";
        break;
    }
  }

  // Something went wrong when the query engine started and the connection to the database is created
  else if (error instanceof PrismaClientInitializationError) {
    errMsgLong = `Initialization error with error code: ${error.errorCode}, Message: ${error.message}`;
    errMsgShort = "Failed to initialize the database connection.";
  }

  // Validation error
  else if (error instanceof PrismaClientValidationError) {
    errMsgLong = `Validation error: ${error.message}`;
    errMsgShort = "Validation failed for the input data.";
  }

  // Underlying engine crashes and exits with a non-zero exit code
  else if (error instanceof PrismaClientRustPanicError) {
    errMsgLong = `Rust panic error: ${error.message}`;
    errMsgShort = "A server error occurred. Please try again later.";
  }

  // Unknown request error (no error code)
  else if (error instanceof PrismaClientUnknownRequestError) {
    errMsgLong = `Unknown request error: ${error.message}`;
    errMsgShort = "An unexpected error occurred.";
  }

  // Generic error handling
  else if (error instanceof Error) {
    errMsgLong = `Unexpected error: ${error.message}`;
    errMsgShort = "An error occurred. Please try again.";
  }

  // Fallback
  else {
    errMsgLong = `Unexpected error: ${error?.toString()}`;
    errMsgShort = "An error occurred. Please try again.";
  }

  console.error(errMsgLong);
  throw new Error(errMsgShort);
}
