import {
  FaWallet,
  FaChartLine,
  FaChartPie,
  FaTrophy,
} from "react-icons/fa";

export default function TradingStats() {
  const stats = [
    {
      icon: <FaWallet />,
      title: "Investment",
      value: "₹2,40,000",
    },
    {
      icon: <FaChartLine />,
      title: "Today's P&L",
      value: "+₹2,340",
    },
    {
      icon: <FaChartPie />,
      title: "Holdings",
      value: "18",
    },
    {
      icon: <FaTrophy />,
      title: "Win Rate",
      value: "63%",
    },
  ];

  return (
    <div className="card">

      <h2>Trading Statistics</h2>

      <div className="stats-grid">

        {stats.map((item, index) => (

          <div className="stat-box" key={index}>

            <div className="stat-icon">

              {item.icon}

            </div>

            <p>{item.title}</p>

            <h3>{item.value}</h3>

          </div>

        ))}

      </div>

    </div>
  );
}