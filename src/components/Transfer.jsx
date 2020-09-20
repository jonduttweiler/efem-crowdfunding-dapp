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
import { addDonation } from '../redux/reducers/donationsSlice'
import User from 'models/User';
import Entity from 'models/Entity';
import FavoriteIcon from '@material-ui/icons/Favorite';
import config from '../configuration';
import { selectCurrentUser } from '../redux/reducers/currentUserSlice'
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import { fetchDonationsByIds, selectDonation, transferDonations } from '../redux/reducers/donationsSlice'
import DonationItemSelectable from './DonationItemSelectable';
import { selectMilestonesByCampaign } from '../redux/reducers/milestonesSlice';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class Transfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transferIsValid: true,
      open: false,
      amount: 0,
      checked: [],
      //left: [0, 1, 2, 3],
      //right: [4, 5, 6, 7],
      left: props.entity.donationIds,
      right: []
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    // this.handleDonate = this.handleDonate.bind(this);
    //this.handleAmountChange = this.handleAmountChange.bind(this);
    //this.handleAmountBlur = this.handleAmountBlur.bind(this);
    //this.checkDonation = this.checkDonation.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);

    this.handleToggle = this.handleToggle.bind(this);
    this.setChecked = this.setChecked.bind(this);
    this.numberOfChecked = this.numberOfChecked.bind(this);
    this.union = this.union.bind(this);
    this.setLeft = this.setLeft.bind(this);
    this.setRight = this.setRight.bind(this);
    this.handleCheckedRight = this.handleCheckedRight.bind(this);
    this.handleCheckedLeft = this.handleCheckedLeft.bind(this);
    this.onChangeMilestone = this.onChangeMilestone.bind(this);
    //this.getDonationById = this.getDonationById.bind(this);
    //this.leftChecked = this.intersection(checked, left);
    //this.rightChecked = this.intersection(checked, right);

    this.handleTransfer = this.handleTransfer.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (JSON.stringify(prevProps.entity.donationIds) !== JSON.stringify(this.props.entity.donationIds)) {
      this.props.fetchDonationsByIds(this.props.entity.donationIds);
      this.setState({
        left: this.props.entity.donationIds
      });
    }
  }

  handleTransfer() {
    const { milestone, right, checked } = this.state;
    const { entity, transferDonations } = this.props;
    transferDonations({
      userAddress: entity.managerAddress,
      entityIdFrom: entity.id,
      entityIdTo: milestone.id,
      donationIds: right
    });
    this.close();
  };

  not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
  }

  intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
  }

  union(a, b) {
    return [...a, ...this.not(b, a)];
  }

  handleToggle(value) {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    this.setChecked(newChecked);
  };

  setChecked(checked) {
    this.setState({
      checked: checked
    });
  }

  setLeft(left) {
    this.setState({
      left: left
    });
  }

  setRight(right) {
    this.setState({
      right: right
    });
  }

  numberOfChecked(items) {
    const { checked } = this.state;
    return this.intersection(checked, items).length;
  }

  handleToggleAll = (items) => () => {
    const { checked } = this.state;
    if (this.numberOfChecked(items) === items.length) {
      this.setChecked(this.not(checked, items));
    } else {
      this.setChecked(this.union(checked, items));
    }
  };

  handleCheckedRight() {
    const { checked, left, right } = this.state;
    let leftChecked = this.intersection(checked, left);
    this.setRight(right.concat(leftChecked));
    this.setLeft(this.not(left, leftChecked));
    this.setChecked(this.not(checked, leftChecked));
  };

  handleCheckedLeft() {
    const { checked, left, right } = this.state;
    let rightChecked = this.intersection(checked, right);
    this.setLeft(left.concat(rightChecked));
    this.setRight(this.not(right, rightChecked));
    this.setChecked(this.not(checked, rightChecked));
  };

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

  onChangeMilestone(milestone) {
    this.setState({
      milestone: milestone
    });
  }

  customList(title, items) {
    const { checked, left, right } = this.state;
    const { classes } = this.props;
    return (
      <Card>
        <CardHeader
          className={classes.cardHeader}
          avatar={
            <Checkbox
              onClick={this.handleToggleAll(items)}
              checked={this.numberOfChecked(items) === items.length && items.length !== 0}
              indeterminate={this.numberOfChecked(items) !== items.length && this.numberOfChecked(items) !== 0}
              disabled={items.length === 0}
              inputProps={{ 'aria-label': 'all items selected' }}
            />
          }
          title={title}
          subheader={`${this.numberOfChecked(items)}/${items.length} selected`}
        />
        <Divider />
        <List className={classes.list} dense component="div" role="list">
          {items.map((donationId) => {
            //const labelId = `transfer-list-all-item-${value}-label`;
            // let donation = this.props.selectDonation(donationId);
            return (
              <DonationItemSelectable
                key={donationId}
                donationId={donationId}
                handleToggle={this.handleToggle}
                isChecked={checked.indexOf(donationId) !== -1}>
              </DonationItemSelectable>
            );
          })}
          <ListItem />
        </List>
      </Card>
    );
  }

  render() {
    const { transferIsValid, open, checked, left, right } = this.state;
    const { milestones, title, description, entityCard, enabled, currentUser, classes, t } = this.props;

    let leftChecked = this.intersection(checked, left);
    let rightChecked = this.intersection(checked, right);

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
            {t('transfer')}
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
                onClick={this.handleTransfer}
                disabled={!transferIsValid}>
                {t('transfer')}
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

                  <Autocomplete
                    id="select-milestone"
                    className={classes.selectMilestone}
                    options={milestones}
                    getOptionLabel={(option) => option.title}
                    style={{ width: 300 }}
                    onChange={(event, newValue) => {
                      this.onChangeMilestone(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} label="Milestone" />}
                  />

                  <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
                    <Grid item>{this.customList('Choices', left)}</Grid>
                    <Grid item>
                      <Grid container direction="column" alignItems="center">
                        <Button
                          variant="outlined"
                          size="small"
                          className={classes.button}
                          onClick={this.handleCheckedRight}
                          disabled={leftChecked.length === 0}
                          aria-label="move selected right"
                        >
                          &gt;
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          className={classes.button}
                          onClick={this.handleCheckedLeft}
                          disabled={rightChecked.length === 0}
                          aria-label="move selected left"
                        >
                          &lt;
                      </Button>
                      </Grid>
                    </Grid>
                    <Grid item>{this.customList('Chosen', right)}</Grid>
                  </Grid>

                </Grid>
              </Grid>
            </Grid>
          </div>
        </Dialog>
      </div >
    );
  }
}

Transfer.propTypes = {
  currentUser: PropTypes.instanceOf(User).isRequired,
  entity: PropTypes.instanceOf(Entity).isRequired,
  tokenAddress: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
};

Transfer.defaultProps = {
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
  },
  /*root: {
    margin: 'auto',
  },*/
  cardHeader: {
    padding: theme.spacing(1, 2),
  },
  list: {
    width: 200,
    height: 230,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
  },
  selectMilestone: {
    flexGrow: 1
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state),
    //donations: selectDonationsByEntity(state, ownProps.entity.id)
    milestones: selectMilestonesByCampaign(state, ownProps.entity.id),
  }
}

const mapDispatchToProps = { addDonation, fetchDonationsByIds, selectDonation, transferDonations }

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(Transfer)
  )
);