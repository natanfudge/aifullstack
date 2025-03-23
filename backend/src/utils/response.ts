import { Response } from 'express';

export const successResponse = (res: Response, data: any, statusCode: number = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
  });
};

export const errorResponse = (res: Response, error: any, statusCode: number = 500) => {
  let errorMessage = 'Internal server error';

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error === null) {
    errorMessage = 'null';
  } else if (error === undefined) {
    errorMessage = 'undefined';
  } else if (typeof error === 'object') {
    errorMessage = JSON.stringify(error);
  } else if (Array.isArray(error)) {
    errorMessage = error.join(', ');
  }

  res.status(statusCode).json({
    success: false,
    error: errorMessage,
  });
}; 