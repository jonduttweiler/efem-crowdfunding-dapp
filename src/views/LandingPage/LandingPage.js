import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";

// Sections for this page
import Campaigns from "components/views/Campaigns.jsx";
import DACs from 'components/views/DACs';
import JoinGivethCommunity from 'components/JoinGivethCommunity.jsx';
import MainMenu from "components/MainMenu.jsx";

import styles from "assets/jss/material-kit-react/views/landingPage.js";
import CommunityButton from "components/CommunityButton";
import { Box } from '@material-ui/core';

const useStyles = makeStyles(styles);

export default function LandingPage(props) {
  const classes = useStyles();
  const { ...rest } = props;
  return (
    <div>
      <Header
        color="transparent"
        brand="Give4Forest"
        rightLinks={<MainMenu />}
        fixed
        changeColorOnScroll={{
          height: 400,
          color: "white"
        }}
        {...rest}
      />
      <Parallax image={require("assets/img/landing-bg.png")}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <h2 className={classes.title}>Crypto-fondos que nos conectan íntimamente con el planeta</h2>
              <h4 className={classes.subtitle}>
                Con <span className={classes.highlight}>Blockchain</span> apoyamos de forma transparente programas que fomentan el reconocimiento de quiénes somos y nuestra conexión con el planeta.
              </h4>
              <br />
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <JoinGivethCommunity history={props.history} />
            {/*<DACs />*/}
            <Campaigns />
        </div>
      </div>
      <Footer />
    </div>
  );
}
