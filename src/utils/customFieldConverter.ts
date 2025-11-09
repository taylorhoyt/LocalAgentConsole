/**
 * Converter utilities for converting between CustomField[] and JSON string
 */

import type { CustomField } from './customFieldTypes';
import { detectFieldType, valueToString } from './customFieldTypes';
import { parseFieldValue } from './customFieldParser';

/**
 * Validates JSON syntax
 */
export function validateJson(jsonString: string): { valid: boolean; error?: string } {
  const trimmed = jsonString.trim();
  
  if (trimmed === '') {
    return { valid: true };
  }

  try {
    JSON.parse(trimmed);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid JSON syntax',
    };
  }
}

/**
 * Converts CustomField[] to JSON string
 */
export function fieldsToJson(customFields: CustomField[]): string {
  const obj: Record<string, unknown> = {};
  
  customFields.forEach((field) => {
    if (field.key.trim()) {
      try {
        obj[field.key.trim()] = parseFieldValue(field.type, field.value);
      } catch (error) {
        // If parsing fails, store as string for backward compatibility
        console.warn(`Failed to parse field ${field.key}:`, error);
        obj[field.key.trim()] = field.value;
      }
    }
  });

  if (Object.keys(obj).length === 0) {
    return '{}';
  }

  return JSON.stringify(obj, null, 2);
}

/**
 * Parses JSON string to CustomField[] with error handling
 */
export function jsonToFields(
  jsonString: string
): { fields: CustomField[]; errors: string[] } {
  const errors: string[] = [];
  const trimmed = jsonString.trim();

  if (trimmed === '') {
    return { fields: [], errors: [] };
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(trimmed);
  } catch (error) {
    return {
      fields: [],
      errors: [
        error instanceof Error ? error.message : 'Invalid JSON syntax',
      ],
    };
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return {
      fields: [],
      errors: ['JSON must be an object (not an array or primitive)'],
    };
  }

  const fields: CustomField[] = [];
  for (const [key, value] of Object.entries(parsed)) {
    try {
      const type = detectFieldType(value);
      const valueStr = valueToString(type, value);
      fields.push({
        key,
        type,
        value: valueStr,
      });
    } catch (error) {
      errors.push(
        `Failed to convert field "${key}": ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
      // Still add the field with a fallback
      fields.push({
        key,
        type: 'string',
        value: String(value),
      });
    }
  }

  return { fields, errors };
}

