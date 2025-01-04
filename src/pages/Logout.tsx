import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} className="bg-[#f4f4f4] rounded-md p-2 text-gray-700 hover:scale-105 transition-all">
      Log Out
    </button>
  );
};

export default LogoutButton;