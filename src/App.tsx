import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { FederatedIntelligence } from './pages/FederatedIntelligence';
import { EntityResolution } from './pages/EntityResolution';
import { RiskScoring } from './pages/RiskScoring';
import { RedTeam } from './pages/RedTeam';
import { Compliance } from './pages/Compliance';
import { TransactionLog } from './pages/TransactionLog';
import { CaseManagement } from './pages/CaseManagement';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/federated" element={<FederatedIntelligence />} />
        <Route path="/entities" element={<EntityResolution />} />
        <Route path="/risk" element={<RiskScoring />} />
        <Route path="/redteam" element={<RedTeam />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/transactions" element={<TransactionLog />} />
        <Route path="/cases" element={<CaseManagement />} />
      </Routes>
    </BrowserRouter>
  );
}
