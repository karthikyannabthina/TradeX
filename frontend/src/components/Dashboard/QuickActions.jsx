import "./QuickActions.css";
import {
  FaPlus,
  FaArrowUp,
  FaShoppingCart,
  FaChartLine,
} from "react-icons/fa";

export default function QuickActions() {
  const actions = [
    {
      title: "Add Funds",
      icon: <FaPlus />,
      color: "#387ed1",
    },
    {
      title: "Withdraw",
      icon: <FaArrowUp />,
      color: "#ff9800",
    },
    {
      title: "Buy Stock",
      icon: <FaShoppingCart />,
      color: "#00c853",
    },
    {
      title: "Sell Stock",
      icon: <FaChartLine />,
      color: "#ef5350",
    },
  ];

  return (
    <div className="quick-actions">

      <h2>Quick Actions</h2>

      <div className="actions-grid">

        {actions.map((item, index) => (

          <div className="action-card" key={index}>

            <div
              className="action-icon"
              style={{ background: item.color }}
            >
              {item.icon}
            </div>

            <h4>{item.title}</h4>

          </div>

        ))}

      </div>

    </div>
  );
}