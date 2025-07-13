export function validateNotEmpty(value: any, fieldName: string): void {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw new Error(`${fieldName} is required and cannot be empty`);
  }
}

export function validateString(value: any, fieldName: string): void {
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }
}

export function validateNumber(value: any, fieldName: string, min?: number, max?: number): void {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(`${fieldName} must be a valid number`);
  }
  
  if (min !== undefined && value < min) {
    throw new Error(`${fieldName} must be at least ${min}`);
  }
  
  if (max !== undefined && value > max) {
    throw new Error(`${fieldName} must be at most ${max}`);
  }
}

export function validateEnum(value: any, fieldName: string, allowedValues: string[]): void {
  if (!allowedValues.includes(value)) {
    throw new Error(`${fieldName} must be one of: ${allowedValues.join(', ')}`);
  }
}

export function validateSearchParams(params: any): void {
  validateNotEmpty(params.keyword, 'keyword');
  validateString(params.keyword, 'keyword');
  
  if (params.type) {
    validateEnum(params.type, 'type', ['note', 'video', 'all']);
  }
  
  if (params.sort) {
    validateEnum(params.sort, 'sort', ['latest', 'popular', 'relevant']);
  }
  
  if (params.limit) {
    validateNumber(params.limit, 'limit', 1, 100);
  }
}