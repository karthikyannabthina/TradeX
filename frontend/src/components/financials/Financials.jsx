import "./Financials.css";

import financialData from "./financialData";

import FinancialSummary from "./FinancialSummary";
import RevenueChart from "./RevenueChart";
import ProfitChart from "./ProfitChart";
import EPSChart from "./EPSChart";
import CashFlowChart from "./CashFlowChart";
import AssetsChart from "./AssetsChart";
import DebtChart from "./DebtChart";

export default function Financials() {
  return (
    <div className="financial-page">

      <FinancialSummary data={financialData} />

      <RevenueChart data={financialData} />

      <ProfitChart data={financialData} />

      <EPSChart data={financialData} />

      <CashFlowChart data={financialData} />

      <AssetsChart data={financialData} />

      <DebtChart data={financialData} />

    </div>
  );
}