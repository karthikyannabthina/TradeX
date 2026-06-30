import "./DashboardCards.css";

const cards = [
  {
    title: "Portfolio",
    value: "₹1,24,500"
  },
  {
    title: "Today's P/L",
    value: "+₹2,450"
  },
  {
    title: "Investment",
    value: "₹1,22,000"
  },
  {
    title: "Current Value",
    value: "₹1,24,500"
  }
];

export default function DashboardCards() {
  return (
    <div className="cards">

      {cards.map((card) => (
        <div className="card">

          <h4>{card.title}</h4>

          <h2>{card.value}</h2>

        </div>
      ))}

    </div>
  );
}