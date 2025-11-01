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

### Endpoint Configuration

1. Click the settings icon in the header to open the Settings modal
2. Configure the following:

   - **Endpoint URL**: The API endpoint for agent invocations
     - Default: `http://localhost:8080/invocations`
     - For localhost:8080 endpoints, a proxy is automatically configured
  
   - **Credentials** (optional):
     - Access Key ID
     - Secret Access Key
     - Region (e.g., `us-east-1`)

3. Click "Save" to persist your settings (saved to localStorage)

Settings are automatically saved and will persist across browser sessions.
