import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux'
import User from 'models/User';
import { selectCurrentUser } from '../redux/reducers/currentUserSlice'
import OnlyCorrectNetwork from './OnlyCorrectNetwork';
import ProfileForm from './ProfileForm';

import { Box } from '@material-ui/core';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class ProfilePopup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  handleClickOpen() {
    this.open();
  };

  handleClose() {
    this.close();
  };

  open() {
    this.setState({
      open: true
    });
  }

  close() {
    this.setState({
      open: false
    });
  }

  render() {
    const { open } = this.state;
    const { title, currentUser, classes, t } = this.props;

    return (
      <div>
          <OnlyCorrectNetwork>
            <Button
              variant="outlined"
              color="link"
              className={classes.button}
              onClick={this.handleClickOpen}
            >
              {"Profile"}
            </Button>
          </OnlyCorrectNetwork>
        <Dialog fullWidth={true}
          maxWidth="md"
          open={open}
          onClose={this.handleClose}
          TransitionComponent={Transition}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={this.handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                {title}
              </Typography>
              <Button autoFocus
                color="inherit"
                onClick={() => console.log("Save profile?")}
                >
                {"save profile"}
              </Button>
            </Toolbar>
          </AppBar>
          <div className={classes.root}>
            <Grid >
              <ProfileForm
                  user={currentUser}
                  isSaving={false}
                  showSubmit={false}
              ></ProfileForm>
            </Grid>
          </div>
        </Dialog>
      </div >
    );
  }
}

ProfilePopup.propTypes = {
  currentUser: PropTypes.instanceOf(User).isRequired,
};

ProfilePopup.defaultProps = {
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: '1em',
  },
  amount: {
    width: '100%',
    marginTop: '1em'
  },
  appBar: {
    position: 'relative'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  button: {
    margin: theme.spacing(1),
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state)
  }
}

const mapDispatchToProps = {  }

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(ProfilePopup)
  )
);