import { Response } from 'express';

export const successResponse = (res: Response, data: any = null, statusCode: number = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
  });
};

export const errorResponse = (res: Response, error: any, statusCode: number = 500) => {
  let errorMessage: string;

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (Array.isArray(error)) {
    errorMessage = error.join(', ');
  } else if (typeof error === 'object' && error !== null) {
    errorMessage = JSON.stringify(error);
  } else {
    errorMessage = error?.toString() || 'Something went wrong';
  }

  res.status(statusCode).json({
    success: false,
    error: errorMessage,
  });
}; 