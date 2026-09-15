export default function TransactionTable({ transactions }) {
  return (
    <div className="table-card">

      <h3>Recent Transactions</h3>

      <table>

        <thead>

          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>

        </thead>

        <tbody>

          {transactions.map((item, index) => (

            <tr key={index}>

              <td>{item.date}</td>

              <td>{item.type}</td>

              <td>{item.amount}</td>

              <td>
                <span
                  className={
                    item.status === "Success"
                      ? "success"
                      : "pending"
                  }
                >
                  {item.status}
                </span>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}