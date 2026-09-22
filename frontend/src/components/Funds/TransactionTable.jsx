export default function TransactionTable({ transactions }) {
  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="table-card">
      <h3>Recent Transactions</h3>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Stock</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="5">No transactions found.</td>
            </tr>
          ) : (
            transactions.map((item) => {
              const date = new Date(item.createdAt);

              const amount =
                Number(item.executedPrice || 0) *
                Number(item.quantity || 0);

              return (
                <tr key={item._id}>
                  <td>{date.toLocaleDateString()}</td>

                  <td>{item.side}</td>

                  <td>{item.symbol}</td>

                  <td>{formatCurrency(amount)}</td>

                  <td>
                    <span
                      className={
                        item.status === "EXECUTED"
                          ? "success"
                          : "pending"
                      }
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}