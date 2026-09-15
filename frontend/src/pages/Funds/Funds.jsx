import "./Funds.css";

import { balance, stats, transactions, allocation } from "../../components/Funds/fundsData";

import BalanceCard from "../../components/Funds/BalanceCard";
import StatCard from "../../components/Funds/StatCard";
import ActionButtons from "../../components/Funds/ActionButtons";
import TransactionTable from "../../components/Funds/TransactionTable";
import PortfolioProgress from "../../components/Funds/PortfolioProgress";

export default function Funds() {
  return (
    <div className="funds-page">

      <div className="funds-header">
        <h1>Funds</h1>
        <p>Manage your account balance and transactions.</p>
      </div>

      <BalanceCard balance={balance} />

      <div className="stats-grid">
        {stats.map((item, index) => (
          <StatCard key={index} stat={item} />
        ))}
      </div>

      <ActionButtons />

      <div className="bottom-grid">

        <div className="left-section">
          <TransactionTable transactions={transactions} />
        </div>

        <div className="right-section">
          <PortfolioProgress allocation={allocation} />
        </div>

      </div>

    </div>
  );
}