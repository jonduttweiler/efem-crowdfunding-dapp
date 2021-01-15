import { title, primaryColor } from "assets/jss/material-kit-react.js";

const blockchainBenefitsStyle = {

  color: "#999",

  section: {
    padding: "0",
    textAlign: "left",
    marginTop: "5em"
  },
  title: {
    ...title,
    minHeight: "32px",
    textDecoration: "none",
    color: "#000",
    width: "50%",
    margin: "0 auto 1em auto",
    textAlign: "center"
  },
  image: {
    width: "20%",
    maxWidth: "80px"
  },
  sectionTitle: {
    color: "#000",
    fontWeight: "bold",
    marginTop: "0.5em",
    marginBottom: "0.5em"
  },
  sectionDescription: {
    color: "#000",
    fontWeight: "normal"
  },
  underlineHighlight: {
    textDecoration: "underline",
    textDecorationColor: "#10B363"
  },
  colorHighlight: {
    color: primaryColor
  },
  boldText: {
    fontWeight: "600"
  },
  italicText: {
    fontStyle: "italic"
  }
};

export default blockchainBenefitsStyle;
