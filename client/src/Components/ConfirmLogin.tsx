// ConfirmLogin.tsx
import React, { useEffect } from "react";

interface ConfirmLoginProps {
  userId: string;
}

const ConfirmLogin: React.FC<ConfirmLoginProps> = ({ userId }) => {
  useEffect(() => {
    // Log the userId when the component mounts
    console.log("Confirming login for user ID:", userId);

    // Cleanup function (optional)
    // Since this effect is intended to run once, the cleanup is not critical
    // However, it's good practice to provide an empty dependency array
    return () => {
      console.log("ConfirmLogin component unmounted");
    };
  }, []); // Empty dependency array ensures the effect runs only once

  // The component doesn't render anything
  return null;
};

export default ConfirmLogin;
