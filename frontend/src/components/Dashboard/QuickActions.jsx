import "./QuickActions.css";

import {
  FaPlus,
  FaArrowUp,
  FaShoppingCart,
  FaChartLine,
} from "react-icons/fa";

export default function QuickActions({ onOrder }) {
  const actions = [
    {
      title: "Add Funds",
      icon: <FaPlus />,
      color: "#387ed1",
      action: null,
    },
    {
      title: "Withdraw",
      icon: <FaArrowUp />,
      color: "#ff9800",
      action: null,
    },
    {
      title: "Buy Stock",
      icon: <FaShoppingCart />,
      color: "#00c853",
      action: () => onOrder?.("BUY"),
    },
    {
      title: "Sell Stock",
      icon: <FaChartLine />,
      color: "#ef5350",
      action: () => onOrder?.("SELL"),
    },
  ];

  return (
    <div className="quick-actions">

      <h2>Quick Actions</h2>

      <div className="actions-grid">

        {actions.map((item) => (
          <button
            className="action-card"
            key={item.title}
            type="button"
            onClick={item.action}
          >

            <div
              className="action-icon"
              style={{ background: item.color }}
            >
              {item.icon}
            </div>

            <h4>
              {item.title}
            </h4>

          </button>
        ))}

      </div>

    </div>
  );
}