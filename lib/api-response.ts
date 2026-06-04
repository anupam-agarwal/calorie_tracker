import { NextResponse } from 'next/server';
import { ApiSuccess, ApiError } from './validation';

const generateRequestId = () => `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Generate successful API response
 */
export function success<T>(
  data: T,
  statusCode: number = 200
): NextResponse<ApiSuccess<T>> {
  return NextResponse.json(
    {
      status: 'success',
      data,
      meta: {
        request_id: generateRequestId(),
        timestamp: new Date().toISOString(),
      },
    },
    { status: statusCode }
  );
}

/**
 * Generate error API response
 */
export function error(
  code: string,
  message: string,
  statusCode: number = 400,
  details?: Record<string, unknown>,
  path?: string
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      status: 'error',
      error: {
        code,
        message,
        details,
        timestamp: new Date().toISOString(),
        path: path || 'unknown',
        request_id: generateRequestId(),
      },
    },
    { status: statusCode }
  );
}

/**
 * Validation error response
 */
export function validationError(
  message: string,
  details?: Record<string, string>,
  path?: string
): NextResponse<ApiError> {
  return error('VALIDATION_ERROR', message, 400, details, path);
}

/**
 * Not found error response
 */
export function notFound(message: string = 'Resource not found', path?: string): NextResponse<ApiError> {
  return error('NOT_FOUND', message, 404, undefined, path);
}

/**
 * Unauthorized error response
 */
export function unauthorized(message: string = 'Unauthorized', path?: string): NextResponse<ApiError> {
  return error('UNAUTHORIZED', message, 401, undefined, path);
}

/**
 * Server error response
 */
export function serverError(
  message: string = 'Internal server error',
  details?: Record<string, unknown>,
  path?: string
): NextResponse<ApiError> {
  return error('INTERNAL_SERVER_ERROR', message, 500, details, path);
}
