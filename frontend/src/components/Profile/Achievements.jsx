import {
  FaTrophy,
  FaMedal,
  FaFire,
  FaStar,
} from "react-icons/fa";

export default function Achievements() {
  const achievements = [
    {
      icon: <FaTrophy />,
      title: "Premium Trader",
      desc: "Active for 2+ years",
    },
    {
      icon: <FaMedal />,
      title: "500+ Orders",
      desc: "Completed successfully",
    },
    {
      icon: <FaFire />,
      title: "Top Performer",
      desc: "63% Win Rate",
    },
    {
      icon: <FaStar />,
      title: "Investor",
      desc: "₹2.4L Portfolio",
    },
  ];

  return (
    <div className="card">

      <h2>Achievements</h2>

      {achievements.map((item, index) => (

        <div className="achievement" key={index}>

          <div className="achievement-icon">

            {item.icon}

          </div>

          <div>

            <h4>{item.title}</h4>

            <p>{item.desc}</p>

          </div>

        </div>

      ))}

    </div>
  );
}