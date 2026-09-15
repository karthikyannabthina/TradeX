export default function PortfolioProgress({ allocation }) {
  return (
    <div className="progress-card">

      <h3>Portfolio Allocation</h3>

      {allocation.map((item, index) => (

        <div
          className="progress-item"
          key={index}
        >

          <div className="progress-header">

            <span>{item.name}</span>

            <span>{item.value}%</span>

          </div>

          <div className="progress-bar">

            <div
              className="progress-fill"
              style={{
                width: `${item.value}%`
              }}
            />

          </div>

        </div>

      ))}

    </div>
  );
}