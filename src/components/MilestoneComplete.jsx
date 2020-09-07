import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'formsy-react-components';
import Modal from 'react-modal';
import Milestone from 'models/Milestone';
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


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-40%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 0 40px #ccc',
    maxHeight: '600px',
  },
};

Modal.setAppElement('#root');

class MilestoneComplete extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
      formIsValid: false,
      isSaving: false,
      message: '',
      items: [],
      isBlocking: false,
      required: false,
      enableAttachProof: true,
      textPlaceholder: '',
      open: false
    };

    this.promise = {};

    this.form = React.createRef();

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onItemsChanged = this.onItemsChanged.bind(this);
    this.submit = this.submit.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
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

  onItemsChanged(items) {
    this.setState({ items });
    this.triggerRouteBlocking();
  }

  openModal({ title, description, cta, required, textPlaceholder, enableAttachProof }) {
    this.setState({
      items: [],
      title,
      description,
      CTA: cta,
      modalIsOpen: true,
      required,
      enableAttachProof,
      textPlaceholder,
    });

    return new Promise((resolve, reject) => {
      this.promise = {
        resolve,
        reject,
      };
    });
  }

  closeModal(reject) {
    if (reject) {
      this.promise.reject();
    } else {
      let activity = new Activity({
        message: this.state.message,
        items: this.state.items
      });
      this.promise.resolve(activity);
    }
    this.setState({ modalIsOpen: false });
  }

  mapInputs(inputs) {
    return {
      message: inputs.message,
    };
  }

  toggleFormValid(state) {
    this.setState({ formIsValid: state });
  }

  triggerRouteBlocking() {
    const form = this.form.current.formsyForm;
    // we only block routing if the form state is not submitted
    this.setState(prevState => ({
      isBlocking:
        form &&
        (!form.state.formSubmitted ||
          form.state.isSubmitting ||
          (prevState.enableAttachProof && prevState.items.length > 0)),
    }));
  }

  submit(model) {
    this.setState(
      prevState => ({
        message: model.message,
        items: prevState.items
      }),
      () => this.closeModal(),
    );
  }

  render() {
    const {
      modalIsOpen,
      message,
      formIsValid,
      isSaving,
      title,
      description,
      CTA,
      items,
      isBlocking,
      enableAttachProof,
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
              <Button autoFocus color="inherit" onClick={this.handleClose}>
                {t('milestoneComplete')}
              </Button>
            </Toolbar>
          </AppBar>



          <Form id="activity"
            onSubmit={this.submit}
            ref={this.form}
            mapping={inputs => this.mapInputs(inputs)}
            onValid={() => this.toggleFormValid(true)}
            onInvalid={() => this.toggleFormValid(false)}
            onChange={e => this.triggerRouteBlocking(e)}
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
                    value={message}
                    placeholder={t('milestoneCompleteMessagePlaceholder')}
                    validations="minLength:3"
                    validationErrors={{
                      minLength: t('milestoneCompleteMessageMinLength'),
                    }}
                    required={true}
                  />
                </Grid>
                <Grid item xs={6}>
                  <span className="label">
                    {t('attachements')}
                  </span>
                  <MilestoneProof
                    isEditMode
                    items={items}
                    onItemsChanged={returnedItems => this.onItemsChanged(returnedItems)}
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

export default withStyles(styles)(
  withTranslation()(MilestoneComplete)
);
