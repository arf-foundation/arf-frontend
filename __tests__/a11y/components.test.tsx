import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ShieldCheck } from 'lucide-react';

import { RiskGauge } from '../../packages/ui/src/RiskGauge';
import { StatusBadge } from '../../packages/ui/src/StatusBadge';
import { DashboardMetricCard } from '../../packages/ui/src/DashboardMetricCard';
import { ExplainabilityModal } from '../../packages/ui/src/ExplainabilityModal';
import NavBar from '../../components/NavBar';

// Component-level accessibility checks using axe-core. Each test renders a
// representative shared component with realistic props and asserts that axe
// finds no violations in the produced markup.

describe('component accessibility (axe)', () => {
  it('RiskGauge has no violations across the severity range', async () => {
    const { container } = render(
      <div>
        <RiskGauge risk={0.2} />
        <RiskGauge risk={0.55} />
        <RiskGauge risk={0.88} />
      </div>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('StatusBadge has no violations for every status', async () => {
    const { container } = render(
      <div>
        <StatusBadge status="safe" />
        <StatusBadge status="warning" />
        <StatusBadge status="critical" />
      </div>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('DashboardMetricCard has no violations', async () => {
    const { container } = render(
      <DashboardMetricCard
        title="Governed decisions"
        icon={ShieldCheck}
        footer="Updated moments ago"
      >
        <p>1,284 decisions processed in the last 24 hours.</p>
      </DashboardMetricCard>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('ExplainabilityModal has no violations when open', async () => {
    const { container } = render(
      <ExplainabilityModal
        open
        onClose={() => {}}
        title="Why this decision was blocked"
        summary="The action exceeded the configured risk threshold for financial operations."
        sections={[
          { heading: 'Risk factors', body: <p>Transaction amount above policy ceiling.</p> },
          { heading: 'Policy', body: <p>Wilson gate rejected the low-confidence approval.</p> },
        ]}
        footer="Audit trail id: 8f21c0"
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('NavBar has no violations', async () => {
    const { container } = render(<NavBar />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
