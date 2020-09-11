import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Donation from '../models/Donation';
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
import { addDonation } from '../redux/reducers/donationsSlice'
import User from 'models/User';
import TextField from '@material-ui/core/TextField';
import FavoriteIcon from '@material-ui/icons/Favorite';
import InputAdornment from '@material-ui/core/InputAdornment';
import config from '../configuration';
import TokenBalance from './TokenBalance';
import Web3Utils from '../utils/Web3Utils';
import { selectUser } from '../redux/reducers/userSlice'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class Donate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      donationIsValid: false,
      open: false,
      amount: 0
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDonate = this.handleDonate.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleAmountBlur = this.handleAmountBlur.bind(this);
    this.checkDonation = this.checkDonation.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  handleClickOpen() {
    this.open();
  };

  handleClose() {
    this.close();
  };

  handleAmountChange(event) {
    this.setState({
      amount: event.target.value === '' ? '' : Number(event.target.value)
    });
    this.checkDonation();
  };

  handleAmountBlur() {
    const { amount } = this.state;
    const { currentUser } = this.props;
    const max = Web3Utils.weiToEther(currentUser.balance);
    if (amount < 0) {
      this.setState({
        amount: 0
      });
    } else if (amount > max) {
      this.setState({
        amount: max
      });
    }
    this.checkDonation();
  };

  checkDonation() {
    const { amount } = this.state;
    let donationIsValid = false;
    if (amount > 0) {
      donationIsValid = true;
    }
    this.setState({
      donationIsValid: donationIsValid
    });
  }

  handleDonate() {
    const { amount } = this.state;
    const { entityId, currentUser, tokenAddress, addDonation } = this.props;
    const donation = new Donation();
    donation.entityId = entityId;
    donation.tokenAddress = tokenAddress;
    donation.amount = Web3Utils.etherToWei(amount);
    donation.giverAddress = currentUser.address;
    addDonation(donation);
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
    const { donationIsValid, open, amount } = this.state;
    const { title, description, entityCard, enabled, currentUser, classes, t } = this.props;

    // TODO Definir parametrización de donación.
    const balance = currentUser.balance;
    const max = Web3Utils.weiToEther(balance);
    const inputProps = {
      step: 0.0001,
      min: 0,
      max: max,
      size: 31
    };


    let tokenConfig = config.tokens[this.props.tokenAddress];
    let tokenSymbol = tokenConfig.symbol;

    return (
      <div>
        {enabled && (
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<FavoriteIcon />}
            onClick={this.handleClickOpen}
          >
            {t('donate')}
          </Button>)
        }
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
                onClick={this.handleDonate}
                disabled={!donationIsValid}>
                {t('donate')}
              </Button>
            </Toolbar>
          </AppBar>
          <div className={classes.root}>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                {entityCard}
              </Grid>
              <Grid item xs={8}>
                <Grid container>
                  <Typography variant="subtitle1" gutterBottom>
                    {description}
                  </Typography>
                  <TokenBalance balance={balance}></TokenBalance>
                  <TextField
                    id="donate-amount"
                    label={t('donateAmount')}
                    className={classes.amount}
                    type="number"
                    value={amount}
                    onChange={this.handleAmountChange}
                    onBlur={this.handleAmountBlur}
                    InputLabelProps={
                      {
                        shrink: true,
                      }
                    }
                    InputProps={
                      {
                        startAdornment: <InputAdornment position="start">{tokenSymbol}</InputAdornment>
                      }
                    }
                    inputProps={inputProps}
                  />
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Dialog>
      </div >
    );
  }
}

Donate.propTypes = {
  currentUser: PropTypes.instanceOf(User).isRequired,
  tokenAddress: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
};

Donate.defaultProps = {
  tokenAddress: config.nativeToken.address,
  enabled: false
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: '1em'
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
    currentUser: selectUser(state)
  }
}

const mapDispatchToProps = { addDonation }

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(Donate)
  )
);