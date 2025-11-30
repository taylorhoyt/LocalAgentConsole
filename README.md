# Local Agent Console

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

   - **Prompt Wrapper Template** (optional): Customize how user prompts are wrapped before being sent to the API

     - Use `{user prompt}` or `{user_prompt}` as placeholders for the actual user input
     - Example: `<user_prompt> {user prompt} </user_prompt>` will wrap the user's message in XML tags
     - Leave empty to send the prompt as-is without any wrapping
     - The wrapper is applied to the user's message before it's included in the request body

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

- `prompt`: The user's message content (wrapped according to the Prompt Wrapper Template if configured)
- Any custom fields configured in the Settings modal

Example request body (without prompt wrapper):

```json
{
  "prompt": "Hello, how are you?",
  "customField1": "value1",
  "customField2": 42,
  "customField3": ["item1", "item2"]
}
```

Example request body (with prompt wrapper template `<user_prompt> {user prompt} </user_prompt>`):

```json
{
  "prompt": "<user_prompt> Hello, how are you? </user_prompt>",
  "customField1": "value1",
  "customField2": 42,
  "customField3": ["item1", "item2"]
}
```
