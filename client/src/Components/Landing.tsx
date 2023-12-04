// Landing.tsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state && location.state.user;

  // if (!user) {
  //   // Handle the case where user data is not available
  //   console.log("user not available")
  // }
  // else {
  //   console.log("user: ", user)
  // }

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
  };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    gap: "150px",
    marginBottom: "50px",
    marginTop: "50px",
  };

  const boxStyle: React.CSSProperties = {
    width: "200px",
    height: "100px",
    border: "2px solid #00718f",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
    color: "#00718f",
    fontWeight: "bolder",
    cursor: "pointer",
    fontSize: "18px",
  };

  const handleClick = (content: string) => {
    console.log(`${content} clicked`);

    if (content === "Currency") {
      navigate("/currency");
    } else if (content === "Calendar") {
      navigate("/calendar");
    } else if (content === "Machine Utilization") {
      navigate("/machine");
    }  else if (content === "Chat") {
      navigate("/chat", { state: { user } });
    }
  };

  return (
    <div style={containerStyle}>
      <div style={rowStyle}>
        <div style={boxStyle} onClick={() => handleClick("Currency")}>
          Currency
        </div>
        <div style={boxStyle} onClick={() => handleClick("Calendar")}>
          Calendar
        </div>
      </div>
      <div style={rowStyle}>
        <div
          style={boxStyle}
          onClick={() => handleClick("Machine Utilization")}
        >
          Machine Utilization
        </div>
        <div style={boxStyle} onClick={() => handleClick("Chat")}>
          Chat
        </div>
      </div>
    </div>
  );
};

export default Landing;
