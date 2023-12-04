import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
const logo = require("../Assets/cadit_logo.png");

interface RouteToHomeText {
  [key: string]: string;
}

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeToHomeText: RouteToHomeText = {
    "/landing": "Home",
    "/register": "Home",
    "/currency": "Currency",
    "/calendar": "Calendar",
    "/machine": "Machine Utilization",
    "/login": "Home",
    "/": "Home",
    "/chat": "Chat",
  };

  // Get the current pathname
  const currentPathname = location.pathname;
  const homeText = routeToHomeText[currentPathname] || "Home";

  const handleIconClick = () => {
    navigate("/landing");
  };

  return (
    <div>
      <div style={{ backgroundColor: "white", padding: "0" }}>
        <img
          src={logo}
          alt="Logo"
          style={{ maxWidth: "10%", height: "70px" }}
        />
        {homeText !== "Home" && (
          <HomeIcon
            style={{
              color: "gray",
              marginLeft: "10px",
              fontSize: "70px",
              cursor: "pointer",
            }}
            onClick={handleIconClick}
          />
        )}
      </div>
      <div
        style={{
          backgroundColor: "#00718f",
          padding: "10px",
          textAlign: "center",
        }}
      >
        <Link to="/" style={{ textDecoration: "none", color: "white" }}>
          <p style={{ margin: 0, fontSize: "18px" }}>{homeText}</p>
        </Link>
      </div>
    </div>
  );
};

export default Header;
