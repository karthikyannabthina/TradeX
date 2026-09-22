import { useEffect, useState } from "react";
import "./Funds.css";

import { getAccount } from "../../services/accountService";
import { getOrders } from "../../services/orderServiceClient";
import { getPortfolio } from "../../features/portfolio/PortfolioAPI";

import useMarketData from "../../context/useMarketData";

import BalanceCard from "../../components/Funds/BalanceCard";
import StatCard from "../../components/Funds/StatCard";
import ActionButtons from "../../components/Funds/ActionButtons";
import TransactionTable from "../../components/Funds/TransactionTable";
import PortfolioProgress from "../../components/Funds/PortfolioProgress";

export default function Funds() {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [allocation, setAllocation] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { getStock } = useMarketData();

  useEffect(() => {
    const loadFunds = async () => {
      try {
        const [
          accountResponse,
          ordersResponse,
          portfolioResponse,
        ] = await Promise.all([
          getAccount(),
          getOrders(),
          getPortfolio(),
        ]);

        const accountData =
          accountResponse?.data?.account ||
          accountResponse?.account ||
          null;

        const ordersData =
          ordersResponse?.data ||
          ordersResponse ||
          [];

        const portfolioData =
          portfolioResponse?.data?.portfolio ||
          portfolioResponse?.portfolio ||
          null;

        setAccount(accountData);
        setTransactions(ordersData);

        const holdings = portfolioData?.holdings || [];

        const holdingsWithValue = holdings.map((holding) => {
          const marketStock = getStock(holding.symbol);

          const ltp = Number(
            marketStock?.price ??
              marketStock?.ltp ??
              marketStock?.currentPrice ??
              holding.averagePrice ??
              0
          );

          const quantity = Number(holding.quantity || 0);

          const currentValue = ltp * quantity;

          return {
            symbol: holding.symbol,
            currentValue,
          };
        });

        const totalPortfolioValue = holdingsWithValue.reduce(
          (sum, holding) => sum + holding.currentValue,
          0
        );

        const allocationData =
          totalPortfolioValue > 0
            ? holdingsWithValue.map((holding) => ({
                name: holding.symbol,
                value: Number(
                  (
                    (holding.currentValue /
                      totalPortfolioValue) *
                    100
                  ).toFixed(2)
                ),
              }))
            : [];

        setAllocation(allocationData);
      } catch (err) {
        console.error("Funds error:", err);

        setError(
          err?.response?.data?.error?.message ||
            "Unable to load funds"
        );
      } finally {
        setLoading(false);
      }
    };

    loadFunds();
  }, []);

  if (loading) {
    return (
      <div className="funds-page">
        <h1>Funds</h1>
        <p>Loading account...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="funds-page">
        <h1>Funds</h1>
        <p className="red">{error}</p>
      </div>
    );
  }

  const balance = account?.balance || 0;
  const blockedAmount = account?.blockedAmount || 0;
  const availableBalance = balance - blockedAmount;

  return (
    <div className="funds-page">
      <div className="funds-header">
        <h1>Funds</h1>
        <p>Manage your account balance and transactions.</p>
      </div>

      <BalanceCard
        balance={{
          available: availableBalance,
          change: 0,
        }}
      />

      <div className="stats-grid">
        <StatCard
          stat={{
            label: "Account Balance",
            value: `₹${balance.toLocaleString("en-IN")}`,
          }}
        />

        <StatCard
          stat={{
            label: "Blocked Amount",
            value: `₹${blockedAmount.toLocaleString("en-IN")}`,
          }}
        />

        <StatCard
          stat={{
            label: "Available Balance",
            value: `₹${availableBalance.toLocaleString("en-IN")}`,
          }}
        />
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