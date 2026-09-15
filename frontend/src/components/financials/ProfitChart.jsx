import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

export default function ProfitChart({ data }) {
  return (
    <div className="chart-card">
      <h3>Profit / Loss</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="year" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="profit">
            {data.map((item, index) => (
              <Cell
                key={index}
                fill={item.profit >= 0 ? "#16a34a" : "#ef4444"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}