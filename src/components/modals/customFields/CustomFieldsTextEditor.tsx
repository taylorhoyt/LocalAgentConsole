import { useState, useEffect } from 'react';

interface CustomFieldsTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

export default function CustomFieldsTextEditor({
  value,
  onChange,
  onValidationChange,
}: CustomFieldsTextEditorProps) {
  const [localValue, setLocalValue] = useState(value);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    onChange(newValue);

    // Validate JSON
    const trimmed = newValue.trim();
    if (trimmed === '') {
      setErrors([]);
      onValidationChange?.(true, []);
      return;
    }

    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        const error = 'JSON must be an object (not an array or primitive)';
        setErrors([error]);
        onValidationChange?.(false, [error]);
      } else {
        setErrors([]);
        onValidationChange?.(true, []);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Invalid JSON syntax';
      setErrors([errorMessage]);
      onValidationChange?.(false, [errorMessage]);
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder='{"field1": "value1", "field2": 42}'
        rows={8}
        className={`w-full px-3 py-2 bg-gray-800 border rounded text-white text-sm focus:outline-none focus:border-blue-500 font-mono resize-y ${
          errors.length > 0
            ? 'border-red-600'
            : 'border-gray-700'
        }`}
      />
      {errors.length > 0 && (
        <div className="text-xs text-red-400 space-y-1">
          {errors.map((error, index) => (
            <div key={index} className="flex items-start gap-1">
              <span className="mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

