import { container, title } from "assets/jss/material-kit-react.js";

const landingPageStyle = {
  container: {
    zIndex: "12",
    color: "#FFFFFF",
    ...container
  },
  title: {
    ...title,
    display: "inline-block",
    position: "relative",
    margin: "1em 10%",
    minHeight: "32px",
    color: "#FFFFFF",
    textDecoration: "none",
    textAlign: "center",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 1)",
    fontWeight: "500",
    width: "70%",
    margin: "1em 15%"
 
  },
  subtitle: {
    textAlign: "center",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 1)",
    fontWeight: "400",
    width: "70%",
    margin: "1em 15%"
  },
  highlight: {
    color: "yellow"
  },
  main: {
    background: "#FFFFFF",
    position: "relative",
    zIndex: "3"
  },
  mainRaised: {
    margin: "-60px 30px 0px",
    borderRadius: "6px",
    boxShadow:
      "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
  }
};

export default landingPageStyle;
