import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button className="bg-[#f4f4f4] rounded-md p-2 text-gray-700 hover:scale-105 transition-all" onClick={() => loginWithRedirect()}>Log In</button>;
};

export default LoginButton;