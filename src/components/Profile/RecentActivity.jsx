export default function RecentActivity() {

  const activities = [

    {
      action: "Bought TCS",
      time: "Today",
      status: "+₹1,250",
    },

    {
      action: "Sold INFY",
      time: "Yesterday",
      status: "+₹850",
    },

    {
      action: "Added Funds",
      time: "2 days ago",
      status: "₹25,000",
    },

    {
      action: "Received Dividend",
      time: "Last Week",
      status: "+₹420",
    },

  ];

  return (

    <div className="card">

      <h2>Recent Activity</h2>

      {activities.map((item, index) => (

        <div className="activity-item" key={index}>

          <div>

            <h4>{item.action}</h4>

            <small>{item.time}</small>

          </div>

          <div className="activity-status">

            {item.status}

          </div>

        </div>

      ))}

    </div>

  );

}