import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'formsy-react-components';
import Milestone from '../models/Milestone';
import MilestoneProof from './MilestoneProof';
import Activity from '../models/Activity';
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
import QuillFormsy from '../components/QuillFormsy';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux'
import { complete } from '../redux/reducers/milestonesSlice';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class MilestoneComplete extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formIsValid: false,
      activity: new Activity({}),
      open: false
    };

    this.promise = {};

    this.form = React.createRef();

    this.handleChangeItems = this.handleChangeItems.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
  }

  handleClickOpen() {
    this.setState({
      open: true
    });
  };

  handleClose() {
    this.setState({
      open: false
    });
  };

  handleComplete() {
    const { milestone } = this.props;
    const { activity } = this.state;
    milestone.status = Milestone.COMPLETING;
    activity.action = Activity.ACTION_COMPLETE;
    this.props.complete({
      milestone,
      activity
    });
    this.setState({
      open: false
    });
  };

  handleChangeMessage(event) {
    const { activity } = this.state;
    activity.message = event.target.value;
    this.setState({
      activity: activity
    });
  };

  handleChangeItems(items) {
    const { activity } = this.state;
    activity.items = items;
    this.setState({
      activity: activity
    });
  };

  render() {
    const {
      activity,
      formIsValid,
      open
    } = this.state;
    const { milestone, classes, t } = this.props;

    return (
      <div>
        <Button color="primary" onClick={this.handleClickOpen}>
          {t('milestoneComplete')}
        </Button>
        <Dialog fullScreen open={open} onClose={this.handleClose} TransitionComponent={Transition}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={this.handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                {t('milestoneCompleteTitle')}
              </Typography>
              <Button autoFocus color="inherit" onClick={this.handleComplete}>
                {t('milestoneComplete')}
              </Button>
            </Toolbar>
          </AppBar>

          <Form id="activity"
            ref={this.form}
            layout="vertical">

            <div className={classes.root}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    {t('milestoneCompleteDescription')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <QuillFormsy
                    name="message"
                    label={t('message')}
                    value={activity.message}
                    placeholder={t('milestoneCompleteMessagePlaceholder')}
                    validations="minLength:3"
                    validationErrors={{
                      minLength: t('milestoneCompleteMessageMinLength'),
                    }}
                    required={true}
                    onChange={this.handleChangeMessage}
                  />
                </Grid>
                <Grid item xs={6}>
                  <span className="label">
                    {t('attachements')}
                  </span>
                  <MilestoneProof
                    isEditMode
                    items={activity.items}
                    onItemsChanged={items => this.handleChangeItems(items)}
                    milestoneStatus={milestone.status}
                  />
                </Grid>
              </Grid>
            </div>
          </Form>
        </Dialog>
      </div >
    );
  }
}

MilestoneComplete.propTypes = {
  milestone: PropTypes.instanceOf(Milestone).isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: '2em'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  control: {
    padding: theme.spacing(2),
  },
});

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = { complete }

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(MilestoneComplete)
  )
);
