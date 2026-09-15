export default function StatusBadge({ status }) {
  let className = "";

  switch (status) {
    case "Completed":
      className = "completed";
      break;

    case "Pending":
      className = "pending";
      break;

    case "Cancelled":
      className = "cancelled";
      break;

    default:
      className = "";
  }

  return (
    <span className={`status ${className}`}>
      {status}
    </span>
  );
}