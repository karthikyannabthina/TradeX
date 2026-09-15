export default function OrderFilters({
  search,
  setSearch,
  status,
  setStatus,
  type,
  setType,
}) {
  return (
    <div className="order-filters">

      <input
        type="text"
        className="input"
        placeholder="Search by stock name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="input"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="All">All Status</option>
        <option value="Completed">Completed</option>
        <option value="Pending">Pending</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      <select
        className="input"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="All">All Types</option>
        <option value="BUY">BUY</option>
        <option value="SELL">SELL</option>
      </select>

    </div>
  );
}