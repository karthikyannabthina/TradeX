export default function FinancialSummary({ data }) {

  const latest = data[data.length - 1];

  return (

    <div className="summary-grid">

      <div className="summary-card">
        <h4>Revenue</h4>
        <h2>₹ {latest.revenue.toLocaleString()}</h2>
      </div>

      <div className="summary-card">
        <h4>Profit</h4>
        <h2>₹ {latest.profit.toLocaleString()}</h2>
      </div>

      <div className="summary-card">
        <h4>EPS</h4>
        <h2>{latest.eps}</h2>
      </div>

      <div className="summary-card">
        <h4>Debt</h4>
        <h2>₹ {latest.debt.toLocaleString()}</h2>
      </div>

    </div>

  );
}