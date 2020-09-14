import React, { Component } from 'react';
import Avatar from 'react-avatar';
import { Link, NavLink, withRouter } from 'react-router-dom';

import { Consumer as Web3Consumer } from '../contextProviders/Web3Provider';
import { history } from '../lib/helpers';

import { connect } from 'react-redux';
import { selectUser } from '../redux/reducers/userSlice';
import LanguageSelector from '../components/LanguageSelector'

// @material-ui/core components
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "components/CustomButtons/Button.js";
import CustomDropdown from './CustomDropdown/CustomDropdown';

import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";
import { withStyles } from '@material-ui/core/styles';

const signUpSwal = () => {
  React.swal({
    title: 'Sign Up!',
    content: React.swal.msg(
      <p>
        In order to use the Dapp, you need to use a Web3 wallet.
        <br />
        It is recommended that you install <a href="https://metamask.io/">MetaMask</a>.
      </p>,
    ),
    icon: 'info',
    buttons: ['Ok'],
  });
};
// Broken rule that can not find the correct id tag
/* eslint jsx-a11y/aria-proptypes: 0 */
/**
 * The main top menu
 */
class MainMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMobileMenu: false,
    };
  }

  componentDidMount() {
    // when route changes, close the menu
    history.listen(() => this.setState({ showMobileMenu: false }));
  }

  toggleMobileMenu() {
    this.setState(prevState => ({ showMobileMenu: !prevState.showMobileMenu }));
  }

  render() {
    const { showMobileMenu } = this.state;

    const { classes, theme, currentUser } = this.props;
    const registered =  currentUser && currentUser.registered || false;

    return (
      <Web3Consumer>
        {({ state: { validProvider, isEnabled, failedToLoad }, actions: { enableProvider } }) => (
          <List className={classes.list}>

          <ListItem className={classes.listItem}>
            <LanguageSelector ></LanguageSelector>
          </ListItem>

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
            {validProvider && !failedToLoad && !isEnabled && (
              <ListItem className={classes.listItem}>
                <Button
                  color="transparent"
                  className={classes.navLink}
                  onClick={signUpSwal}
                >
                  Reg&iacute;strate!
                </Button>
              </ListItem>
            )}

            {currentUser && (
              <ListItem className={classes.listItem}>
                <CustomDropdown
                  noLiPadding
                  //TODO: mostrar avatar del usuario
                  /*avatar={currentUser.avatar && (
                          <Avatar
                            className="menu-avatar"
                            size={30}
                            src={currentUser.avatar}
                            round
                          />
                        )}*/
                  buttonText={(currentUser.name && <span>{currentUser.name}</span>) ||
                              (!currentUser.name && <span>&iexcl;Hola!</span>)}
                  buttonProps={{
                    className: classes.navLink,
                    color: "transparent"
                  }}
                  dropdownList={[
                    <NavLink className={classes.dropdownLink} to="/profile">
                        {registered ? <span>Perfil</span> : <span>Reg&iacute;strate</span>} 
                    </NavLink>
                  ]}
                />
              </ListItem>
              )}
          </List>
        )}
      </Web3Consumer>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  currentUser: selectUser(state)
});
const mapDispatchToProps = { };

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(MainMenu)))

MainMenu.propTypes = {};
MainMenu.defaultProps = {};
