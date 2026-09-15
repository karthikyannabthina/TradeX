export default function StatCard({ stat }) {
  return (
    <div className="stat-card">

      <h4>{stat.title}</h4>

      <h2 style={{ color: stat.color }}>
        {stat.value}
      </h2>

    </div>
  );
}