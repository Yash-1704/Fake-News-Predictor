import { Check } from 'lucide-react';

const freeFeatures = [
  'Article pattern analysis',
  'Limited-context fact-checks',
  '5 lifetime web-search fact-checks',
];

const premiumFeatures = [
  'Article pattern analysis',
  'Limited-context fact-checks',
  'Unlimited web-search fact-checks',
];

function PlanFeatures({ features }) {
  return (
    <ul className="plan-features">
      {features.map((feature) => <li key={feature}><Check size={16} />{feature}</li>)}
    </ul>
  );
}

export function PremiumPage() {
  return (
    <main className="page-shell content-page premium-page">
      <header className="page-heading">
        <p className="meta-label">MEMBERSHIP</p>
        <h1>More room to verify.</h1>
        <p>Compare the current free allowance with unlimited web-search fact-checks.</p>
      </header>

      <div className="premium-plans">
        <section className="premium-plan" aria-labelledby="free-plan-title">
          <p className="section-kicker">CURRENT PLAN</p>
          <h2 id="free-plan-title">Free</h2>
          <p className="plan-price">$0 <span>forever</span></p>
          <PlanFeatures features={freeFeatures} />
        </section>

        <section className="premium-plan premium-plan-featured" aria-labelledby="premium-plan-title">
          <p className="section-kicker">ADMIN ACTIVATED</p>
          <h2 id="premium-plan-title">Premium</h2>
          <p className="plan-price">Unlimited <span>web searches</span></p>
          <PlanFeatures features={premiumFeatures} />
          <button className="button button-primary premium-demo-button" type="button" disabled>
            $6.9
          </button>
        </section>
      </div>

      <p className="premium-note">This is an informational demo. No payment is collected and this page cannot change account status. Premium access is activated manually by the project administrator.</p>
    </main>
  );
}