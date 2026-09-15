import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaUniversity
} from "react-icons/fa";

export default function UserDetails() {

  return (

    <div className="card">

      <h2>Account Details</h2>

      <div className="detail-item">

        <FaUser className="detail-icon"/>

        <div>

          <span>Name</span>

          <h4>Karthik</h4>

        </div>

      </div>

      <div className="detail-item">

        <FaEnvelope className="detail-icon"/>

        <div>

          <span>Email</span>

          <h4>karthik@gmail.com</h4>

        </div>

      </div>

      <div className="detail-item">

        <FaPhone className="detail-icon"/>

        <div>

          <span>Phone</span>

          <h4>+91 9876543210</h4>

        </div>

      </div>

      <div className="detail-item">

        <FaIdCard className="detail-icon"/>

        <div>

          <span>PAN</span>

          <h4>ABCDE1234F</h4>

        </div>

      </div>

      <div className="detail-item">

        <FaUniversity className="detail-icon"/>

        <div>

          <span>Bank</span>

          <h4>HDFC Bank</h4>

        </div>

      </div>

    </div>

  );

}