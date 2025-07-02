# ONDC QuickSubscribe Client

A modern React TypeScript application that automates ONDC (Open Network for Digital Commerce) onboarding in 1-2 hours. ONDC QuickSubscribe Client provides a comprehensive suite of tools for automated key generation, header management, testing, and deployment assistance - transforming complex manual processes into simple workflows.

## 🎯 Overview

This React application serves as the frontend interface for ONDC subscription utilities, offering an intuitive user experience for managing cryptographic operations, API testing, and subscription workflows.

## ✨ Features

### 🔑 Key Generator
- **Multi-Language Support**: Generate keys for Node.js, Python, Java, PHP, Go, and .NET
- **Environment Configuration**: Support for staging and production environments
- **Secure Key Generation**: Ed25519 signing keys and X25519 encryption keys
- **Export Functionality**: Download generated keys in various formats
- **Session Management**: Secure session-based key storage

### 🔐 ONDC Subscriber
- **Subscription Management**: Handle ONDC network subscriptions
- **Registry Integration**: Connect with ONDC registries
- **Status Monitoring**: Real-time subscription status tracking
- **Configuration Management**: Environment-specific settings

### 🛠️ Header Tools
- **Authorization Headers**: Create and verify ONDC authorization headers
- **Request Signing**: Digital signature creation and validation
- **Header Analysis**: Detailed header breakdown and validation
- **Testing Utilities**: Test headers against ONDC specifications

### 🧪 Testing Suite
- **API Endpoint Testing**: Comprehensive API testing capabilities
- **Mock Data Generation**: Generate test data for ONDC workflows
- **Response Validation**: Validate API responses against ONDC schemas
- **Performance Testing**: Load and performance testing tools

### 🚀 Deployment Helper
- **Environment Setup**: Guided deployment configuration
- **Docker Support**: Containerization assistance
- **Configuration Validation**: Pre-deployment checks
- **Documentation**: Step-by-step deployment guides

### 📊 Dashboard
- **Activity Overview**: Real-time system status and metrics
- **Session Management**: Active session monitoring
- **Analytics**: Usage statistics and performance metrics
- **System Health**: Server connectivity and health checks

## 🏗️ Architecture

```
src/
├── components/           # Reusable UI components
│   └── Navbar.tsx       # Navigation component
├── pages/               # Main application pages
│   ├── Dashboard.tsx    # Main dashboard
│   ├── KeyGenerator.tsx # Key generation utilities
│   ├── ONDCSubscriber.tsx # ONDC subscription management
│   ├── HeaderTools.tsx  # Header creation and validation
│   ├── TestingSuite.tsx # API testing tools
│   └── DeploymentHelper.tsx # Deployment assistance
├── utils/               # Utility functions
│   ├── toast.tsx        # Toast notification utilities
│   └── toastExamples.ts # Toast examples and templates
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- ONDC Backend Server running on port 5000

### Installation

1. **Clone and Navigate**
   ```bash
   cd ondc-react-app/client
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   The application is configured to proxy API requests to `http://localhost:5000` (backend server).

4. **Start Development Server**
   ```bash
   npm start
   ```
   
   The application will open at [http://localhost:3000](http://localhost:3000)

## 📦 Available Scripts

### `npm start`
Runs the app in development mode with hot reloading.

### `npm run build`
Builds the app for production to the `build` folder with optimized bundles.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run eject`
**⚠️ Warning**: This is a one-way operation. Ejects from Create React App configuration.

## 🎨 UI Components & Libraries

- **Material-UI (MUI)**: Modern React component library
- **React Router**: Client-side routing and navigation
- **React Hot Toast**: Beautiful toast notifications
- **React Syntax Highlighter**: Code syntax highlighting
- **React Copy to Clipboard**: Copy functionality
- **Axios**: HTTP client for API requests

## 🔌 API Integration

The client integrates with the ONDC Backend Server through these endpoints:

### Key Management
- `POST /api/generate-keys` - Generate new key pairs
- `GET /api/keys/:sessionId` - Retrieve session keys
- `PUT /api/keys/:sessionId` - Update session keys
- `GET /api/keys/:sessionId/download` - Download keys as JSON

### Header Operations
- `POST /api/create-header` - Create authorization headers
- `POST /api/verify-header` - Verify header signatures

### Health & Status
- `GET /health` - Backend health check
- Various ONDC-specific endpoints for subscription management

## 🎯 Page-by-Page Guide

### Dashboard
- **Overview**: Central hub with system status and quick actions
- **Features**: Session monitoring, health checks, activity feed
- **Navigation**: Access to all major features

### Key Generator
- **Purpose**: Generate cryptographic keys for ONDC integration
- **Languages**: Support for 6+ programming languages
- **Environments**: Staging and production configurations
- **Export**: Download keys in JSON format

### ONDC Subscriber
- **Functionality**: Manage ONDC network subscriptions
- **Features**: Registry connections, subscription status, configuration
- **Workflow**: Step-by-step subscription process

### Header Tools
- **Create Headers**: Generate ONDC-compliant authorization headers
- **Verify Headers**: Validate existing headers
- **Testing**: Test headers against ONDC specifications
- **Analysis**: Detailed header breakdown and debugging

### Testing Suite
- **API Testing**: Comprehensive endpoint testing
- **Mock Data**: Generate test payloads
- **Validation**: Response schema validation
- **Performance**: Load testing capabilities

### Deployment Helper
- **Guided Setup**: Step-by-step deployment assistance
- **Configuration**: Environment-specific settings
- **Validation**: Pre-deployment checks
- **Documentation**: Deployment best practices

## 🔐 Security Features

- **Secure Sessions**: Session-based key management
- **Input Validation**: Client-side validation with server verification
- **CORS Handling**: Proper cross-origin request handling
- **Token Management**: Secure handling of authentication tokens

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Desktop Support**: Full desktop functionality
- **Accessibility**: WCAG compliance considerations
- **Modern UI**: Material Design principles

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
- API endpoint testing
- Component integration tests
- User workflow testing

## 🚀 Production Build

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Deploy Build**
   The `build` folder contains the production-ready static files.

3. **Environment Variables**
   Configure production API endpoints as needed.

## 🛠️ Development Tips

- **Hot Reloading**: Changes reflect immediately during development
- **DevTools**: React DevTools recommended for debugging
- **API Proxy**: Configured to proxy `/api/*` requests to backend
- **Error Handling**: Comprehensive error boundaries and user feedback

## 📊 Performance

- **Code Splitting**: Lazy loading for optimal performance
- **Bundle Optimization**: Webpack optimizations included
- **Caching**: Efficient asset caching strategies
- **Monitoring**: Performance monitoring capabilities

## 🤝 Contributing

1. Follow React and TypeScript best practices
2. Use Material-UI components when possible
3. Maintain responsive design principles
4. Include comprehensive error handling
5. Write unit tests for new features

## 🔗 Related Projects

- **Backend Server**: Located in `../server/`
- **ONDC SDK**: Integration with ONDC cryptography SDK
- **Multi-Language Support**: Compatible with Node.js, Python, Java, PHP, Go, and .NET implementations

## 📚 Additional Resources

- [ONDC Documentation](https://ondc.org)
- [React Documentation](https://reactjs.org/)
- [Material-UI Documentation](https://mui.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
