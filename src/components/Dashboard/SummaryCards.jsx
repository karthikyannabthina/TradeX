import "./SummaryCards.css";

const summaryData = [
  {
    title: "Portfolio Value",
    value: "₹1,24,500",
    change: "+2.45%",
  },
  {
    title: "Today's P/L",
    value: "+₹2,450",
    change: "+1.85%",
  },
  {
    title: "Invested",
    value: "₹1,22,000",
    change: "",
  },
  {
    title: "Available Funds",
    value: "₹25,000",
    change: "",
  },
];

export default function SummaryCards() {
  return (
    <div className="summary-grid">
      {summaryData.map((item) => (
        <div className="summary-card" key={item.title}>
          <h4>{item.title}</h4>
          <h2>{item.value}</h2>
          <p>{item.change}</p>
        </div>
      ))}
    </div>
  );
}