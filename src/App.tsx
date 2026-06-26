import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import OnboardingList from '@/pages/OnboardingList';
import OnboardingDetail from '@/pages/OnboardingDetail';
import Monitoring from '@/pages/Monitoring';
import Policy from '@/pages/Policy';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/onboarding" element={<OnboardingList />} />
          <Route path="/onboarding/:id" element={<OnboardingDetail />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/policy" element={<Policy />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
