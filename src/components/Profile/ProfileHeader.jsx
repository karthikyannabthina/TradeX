import "../../components/Profile/Profile.css";
import { FaEdit, FaMapMarkerAlt, FaCrown } from "react-icons/fa";

export default function ProfileHeader() {
  return (
    <div className="profile-header">

      <div className="profile-left">

        {/* <img
          src="https://i.pravatar.cc/150"
          alt="Profile"
        /> */}

        <div>

          <h2>Karthik</h2>

          <p className="designation">
             Investor
          </p>

          <div className="profile-tags">

            <span>
              <FaMapMarkerAlt />
              India
            </span>

            <span>
              <FaCrown />
              Premium Trader
            </span>

          </div>

        </div>

      </div>

      <button>

        <FaEdit />

        Edit Profile

      </button>

    </div>
  );
}