import "../../components/Profile/Profile.css";



import ProfileHeader from "../../components/Profile/ProfileHeader";
import UserDetails from "../../components/Profile/UserDetails";
import TradingStats from "../../components/Profile/TradingStats";

import Achievements from "../../components/Profile/Achievements";
import RecentActivity from "../../components/Profile/RecentActivity";

export default function Profile() {

  return (

    <div className="profile-page">

      <ProfileHeader />

      <div className="profile-grid">

        <UserDetails />

        <TradingStats />

      </div>

      <div className="extra-grid">

        <Achievements />

        <RecentActivity />

      </div>

    </div>

  );

}