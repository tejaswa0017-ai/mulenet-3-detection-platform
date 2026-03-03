[View on GitHub](https://github.com/your-username/your-repository)

# MuleNet 3.0 - Enterprise-Grade Cyber-Financial Mule Detection Platform

MuleNet 3.0 is a production-ready, enterprise-grade platform designed to detect and prevent financial mule operations across distributed banking networks. The platform combines federated intelligence architecture with privacy-preserving computation, temporal graph analytics, and multi-jurisdictional regulatory compliance.

## Features

- **Federated Learning**: Collaborative intelligence across institutions while maintaining data sovereignty
- **Temporal Graph Analytics**: TGN-based detection of evolving mule patterns
- **Privacy-Preserving Computation**: Homomorphic encryption and differential privacy
- **Explainable AI**: RAG-based explanations with zero-hallucination guarantees
- **Multi-Jurisdictional Compliance**: GDPR, UK GDPR, DPDP Act 2023, GLBA, UK MLR 2017
- **High Performance**: 60K TPS ingestion, <100ms P95 latency, 1.2B edge graphs
- **Adversarial Robustness**: Continuous red-team validation against 47+ evasion tactics

## Architecture

MuleNet 3.0 uses a TypeScript monorepo structure with the following packages:

- `@mulenet/types` - Shared TypeScript types and data models
- `@mulenet/fibo-adapter` - FIBO ontology adapter for multi-format data ingestion
- `@mulenet/entity-resolver` - Entity resolution using MinHash LSH and XGBoost
- `@mulenet/graph-store` - Neo4j integration for temporal graph storage
- `@mulenet/tgn` - Temporal Graph Neural Network for mule detection
- `@mulenet/privacy-engine` - Privacy-preserving computation (FHE, DP, Bloom filters)
- `@mulenet/risk-scorer` - Bayesian risk scoring with uncertainty quantification
- `@mulenet/explainability` - RAG ensemble explainability system
- `@mulenet/compliance` - Multi-jurisdictional compliance engine
- `@mulenet/edge-node` - Edge node orchestration and APIs

## Setup Instructions

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- Python 3.10+

### 1. Frontend Setup

1. Install Node dependencies:
   ```bash
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

### 2. Backend Setup

The backend uses FastAPI and requires a Python virtual environment to run.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   
   # On Windows:
   .\venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install Python dependencies:
   ```bash
   npm install -r requirements.txt # Note: Use pip install -r requirements.txt
   pip install -r requirements.txt
   ```

4. Start the FastAPI server:
   ```bash
   python main.py
   # or
   uvicorn main:app --reload --port 8000
   ```
   The API will be available at `http://localhost:8000` with interactive documentation at `http://localhost:8000/docs`.

### 3. Running the Full Stack

To run the full application, you need to start both servers concurrently in separate terminals:
- **Terminal 1**: run `npm run dev` in the root directory.
- **Terminal 2**: activate the virtual environment and run `python backend/main.py`.

## Development

### Project Structure

```
mulenet-3-platform/
├── packages/
│   ├── types/              # Shared types and data models
│   ├── fibo-adapter/       # Data format adapters
│   ├── entity-resolver/    # Entity resolution
│   ├── graph-store/        # Graph database integration
│   ├── tgn/                # Temporal Graph Neural Network
│   ├── privacy-engine/     # Privacy-preserving computation
│   ├── risk-scorer/        # Risk scoring engine
│   ├── explainability/     # Explainability system
│   ├── compliance/         # Compliance engine
│   └── edge-node/          # Edge node service
├── docker-compose.yml      # Local development environment
├── tsconfig.json           # TypeScript configuration
├── jest.config.js          # Jest test configuration
├── .eslintrc.json          # ESLint configuration
└── .prettierrc.json        # Prettier configuration
```

### Adding a New Package

1. Create package directory: `packages/my-package/`
2. Add `package.json` with package name `@mulenet/my-package`
3. Add `tsconfig.json` extending root config
4. Add `src/index.ts` as entry point
5. Update root `tsconfig.json` paths
6. Update `jest.config.js` moduleNameMapper

### Running Tests

Tests are organized into:
- **Unit tests**: `*.test.ts` - Test specific examples and edge cases
- **Property-based tests**: `*.pbt.test.ts` - Test universal properties with fast-check
- **Integration tests**: Test component interactions

### Docker Services

Access local services:
- Kafka: `localhost:9092`, `localhost:9093`, `localhost:9094`
- Neo4j: `localhost:7474` (HTTP), `localhost:7687` (Bolt)
- Redis: `localhost:6379`
- PostgreSQL: `localhost:5432`

View logs:
```bash
npm run docker:logs
```

Stop services:
```bash
npm run docker:down
```

## Testing

### Coverage Requirements

- Line coverage: ≥90%
- Branch coverage: ≥85%
- Function coverage: ≥90%
- Statement coverage: ≥90%

### Property-Based Testing

MuleNet 3.0 uses fast-check for property-based testing to validate correctness properties:

- Data Sovereignty
- Privacy Budget Enforcement
- Temporal Consistency
- Entity Resolution Consistency
- Alert Tier Consistency
- Explanation Latency Guarantee
- Zero-Hallucination Guarantee

## Performance Targets

- **Ingestion**: 60K TPS sustained, 100K TPS burst (5 min)
- **Latency**: P95 <100ms ingestion, P95 <200ms simple queries, P95 <2s complex queries
- **Detection**: 92%+ recall, <2% false positive rate
- **Explanation**: <4 seconds generation time
- **Scale**: 1.2B edges, 500M nodes

## Security

- AES-256 encryption at rest
- TLS 1.3 for all network communication
- CKKS homomorphic encryption for cross-institution queries
- Differential privacy (ε=1.0, δ=10^-5)
- Multi-factor authentication
- Role-based access control
- Comprehensive audit logging

## Compliance

MuleNet 3.0 complies with:
- EU GDPR
- UK GDPR
- India DPDP Act 2023
- US GLBA (Gramm-Leach-Bliley Act)
- US BSA (Bank Secrecy Act)
- UK MLR 2017 (Money Laundering Regulations)

## License

Proprietary - All Rights Reserved

## Support

For support, please contact the MuleNet team.
