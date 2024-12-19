import React from "react";
import UserWalletBalance from "../UserWalletBalance/userWalletBalance";

const Dashboard = ({ user }) => {
  return (
    <div>
      <h1>Welcome, {user?.username || "Guest"}!</h1>
      {user && <UserWalletBalance user={user} />}
    </div>
  );
};

export default Dashboard;
