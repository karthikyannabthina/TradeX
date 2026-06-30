import "./PortfolioChart.css";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { day: "Mon", value: 121000 },
  { day: "Tue", value: 122500 },
  { day: "Wed", value: 121900 },
  { day: "Thu", value: 123700 },
  { day: "Fri", value: 124500 },
];

export default function PortfolioChart() {
  return (
    <div className="portfolio-card">
      <h2>Portfolio Performance</h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <Tooltip />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#387ed1"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}