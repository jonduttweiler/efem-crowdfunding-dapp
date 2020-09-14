/*eslint-disable*/
import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
// react components for routing our app without refresh
import { Link } from "react-router-dom";

import { Consumer as Web3Consumer } from '../../contextProviders/Web3Provider';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

// @material-ui/icons
import { Apps, CloudDownload } from "@material-ui/icons";

// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";
import LanguageSelector from "components/LanguageSelector";

import { connect } from 'react-redux';
import { selectUser } from '../../redux/reducers/userSlice';

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {

  const classes = useStyles();
  
  const { currentUser } = props;
  const registered =  currentUser && currentUser.registered || false;

  return (
    <Web3Consumer>
        {({ state: { validProvider, isEnabled, failedToLoad }, actions: { enableProvider } }) => (

          <List className={classes.list}>

            {validProvider && !failedToLoad && !isEnabled && (
              <ListItem className={classes.listItem}>
                <Button
                  color="transparent"
                  target="_blank"
                  className={classes.navLink}
                  onClick={() => enableProvider()}
                >
                  Enable Web3
                </Button>
              </ListItem>
            )}
            {validProvider && !failedToLoad && isEnabled && !currentUser && (
              <small className="text-muted">Please unlock MetaMask</small>
            )}
            {!validProvider && (
              <ListItem className={classes.listItem}>
                <Button
                  color="transparent"
                  target="_blank"
                  className={classes.navLink}
                  onClick={signUpSwal}
                >
                  Reg&iacute;strate!
                </Button>
              </ListItem>
            )}

            {currentUser && (
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  id="navbarDropdownYou"
                  to="/"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {currentUser.avatar && (
                    <Avatar
                      className="menu-avatar"
                      size={30}
                      src={currentUser.avatar}
                      round
                    />
                  )}

                  {currentUser.name && <span>{currentUser.name}</span>}

                  {!currentUser.name && <span>&iexcl;Hola!</span>}
                </Link>
                <div
                  className={`dropdown-menu dropdown-profile ${showMobileMenu ? 'show' : ''}`}
                  aria-labelledby="navbarDropdownYou"
                >
                  <NavLink className="dropdown-item" to="/profile">
                    {registered ? <span>Perfil</span> : <span>Reg&iacute;strate</span>} 
                  </NavLink>
                  {/* <NavLink className="dropdown-item" to="/wallet">
                        Wallet
                      </NavLink> */}
                </div>
              </li>
            )}

            <ListItem className={classes.listItem}>
              <CustomDropdown
                noLiPadding
                buttonText="Components"
                buttonProps={{
                  className: classes.navLink,
                  color: "transparent"
                }}
                buttonIcon={Apps}
                dropdownList={[
                  <Link to="/" className={classes.dropdownLink}>
                    All components
                  </Link>,
                  <a
                    href="https://creativetimofficial.github.io/material-kit-react/#/documentation?ref=mkr-navbar"
                    target="_blank"
                    className={classes.dropdownLink}
                  >
                    Documentation
                  </a>
                ]}
              />
            </ListItem>
            </List>

        )}
    </Web3Consumer>
  );
}

const mapStateToProps = (state, ownProps) => ({
  currentUser: selectUser(state)
});
const mapDispatchToProps = { };

const HeaderLinksConnected = connect(mapStateToProps,mapDispatchToProps)(HeaderLinks);

//export default withRouter(HeaderLinksConnected);


