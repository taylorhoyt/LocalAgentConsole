# Basic Streaming Agent Interface

A React-based chat interface for streaming agent interactions.

## Getting Started

### Installation

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

## Configuration

### Settings Modal

1. Click the settings icon in the header to open the Settings modal
2. Configure the following:

   - **Endpoint URL**: The API endpoint for agent invocations
     - Default: `http://localhost:8080/invocations`
     - For localhost:8080 endpoints, a proxy is automatically configured
  
   - **Credentials** (optional):
     - Access Key ID
     - Secret Access Key
     - Region (e.g., `us-east-1`)

   - **Custom Request Fields** (optional): Add custom key-value pairs to be included in the request body
     - Click "+ Add Field" to add a new field
     - Configure each field with:
       - **Key**: The field name
       - **Type**: One of the supported types (see below)
       - **Value**: The field value (formatted according to the selected type)
     - Supported field types:
       - `string`: Plain text (e.g., `"hello world"`)
       - `number`: Numeric values (e.g., `42`)
       - `boolean`: Boolean values (e.g., `true` or `false`)
       - `string[]`: Array of strings (e.g., `"apple", "banana", "cherry"`)
       - `number[]`: Array of numbers (e.g., `1, 2, 3, 4, 5`)
       - `boolean[]`: Array of booleans (e.g., `true, false, true`)
       - `object`: JSON objects (e.g., `{"nested": {"key": "value"}}`)
     - Custom fields are merged into the request body along with the `prompt` field when making API calls

3. Click "Save" to persist your settings (saved to localStorage)

Settings are automatically saved and will persist across browser sessions.

### Request Body Format

When sending a message, the request body sent to the endpoint includes:
- `prompt`: The user's message content
- Any custom fields configured in the Settings modal

Example request body:
```json
{
  "prompt": "Hello, how are you?",
  "customField1": "value1",
  "customField2": 42,
  "customField3": ["item1", "item2"]
}
```
