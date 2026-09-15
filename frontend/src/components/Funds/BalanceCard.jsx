import { FaWallet } from "react-icons/fa";

export default function BalanceCard({ balance }) {
  return (
    <div className="balance-card">

      <div className="balance-top">
        <div>
          <h4>Available Balance</h4>

          <h1>
            ₹{balance.available.toLocaleString()}
          </h1>

          <p className="positive">
            ▲ {balance.change}% Today
          </p>
        </div>

        <div className="wallet-icon">
          <FaWallet />
        </div>
      </div>

    </div>
  );
}