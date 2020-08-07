/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { Prompt } from 'react-router-dom';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { Form, Input } from 'formsy-react-components';
import GA from 'lib/GoogleAnalytics';
import Milestone from 'models/Milestone';
import Loader from '../Loader';
import QuillFormsy from '../QuillFormsy';
import SelectFormsy from '../SelectFormsy';
import FormsyImageUploader from '../FormsyImageUploader';
import GoBackButton from '../GoBackButton';
import { isOwner, getTruncatedText } from '../../lib/helpers';
import { authenticateIfPossible, checkProfile } from '../../lib/middleware';
import LoaderButton from '../LoaderButton';
import User from '../../models/User';
import ErrorPopup from '../ErrorPopup';
import { Consumer as WhiteListConsumer } from '../../contextProviders/WhiteListProvider';

import RolesListProvider, { Consumer as RolesListConsumer } from '../../contextProviders/RolesListProvider';
import MilestoneService from '../../services/MilestoneService';
import FiatUtils from '../../utils/FiatUtils';
import { connect } from 'react-redux'
import { selectCampaign } from '../../redux/reducers/campaignsSlice'
import { isCampaignManager } from '../../redux/reducers/userSlice';
import { addMilestone } from '../../redux/reducers/milestonesSlice'


BigNumber.config({ DECIMAL_PLACES: 18 });

/**
 * Create or edit a Milestone
 *
 *  @props
 *    isNew (bool):
 *      If set, component will load an empty model.
 *      If not set, component expects an id param and will load a milestone object from backend
 *
 *  @params
 *    id (string): an id of a milestone object
 */
class EditMilestone extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isSaving: false,
      formIsValid: false,
      milestone: new Milestone({}),
      isBlocking: false,
    };

    this.form = React.createRef();

    this.submit = this.submit.bind(this);
    this.setImage = this.setImage.bind(this);
    this.changeSelectedFiat = this.changeSelectedFiat.bind(this);
    this.onItemsChanged = this.onItemsChanged.bind(this);
  }

  componentDidMount() {

    this.checkUser()
      .then(async () => {
        this.setState({
          //campaignId: this.props.match.params.id,
        });

        // load a single milestones (when editing)
        if (!this.props.isNew) {
        
          try {
            const milestone = await MilestoneService.get(this.props.match.params.milestoneId);

            if (
              !(
                isOwner(milestone.managerAddress, this.props.currentUser) ||
                isOwner(milestone.campaign.managerAddress, this.props.currentUser)
              )
            ) {
              this.props.history.goBack();
            }
            this.setState({
              milestone,
              campaign: milestone.campaign
            });

            this.setState({
              isLoading: false,
            });
          } catch (err) {
            ErrorPopup(
              'Sadly we were unable to load the requested milestone details. Please try again.',
              err,
            );
          }
        } else {
          try {
            const milestone = new Milestone();
            // El destinatario es quien crea el milestone.
            milestone.recipientAddress = this.props.currentUser.address;
            this.setState({
              isLoading: false,             
              milestone,
              campaign: this.props.campaign
            });
          } catch (e) {
            ErrorPopup(
              'Sadly we were unable to load the campaign in which this milestone was created. Please try again.',
              e,
            );
          }
        }
      })
      .catch(err => {
        // TODO: This is not super user friendly, fix it
        if (err === 'noBalance') this.props.history.goBack();
        else {
          ErrorPopup('Something went wrong. Please try again.', err);
        }
      });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentUser !== this.props.currentUser) {
      this.checkUser().then(() => {
        if (false
          //!isOwner(this.state.milestone.managerAddress, this.props.currentUser) ||
          //!isOwner(this.state.milestone.campaign.managerAddress, this.props.currentUser)
        )
          this.props.history.goBack();
      });
    }
  }

  onAddItem(item) {
    this.addItem(item);
    this.setState({ addMilestoneItemModalVisible: false });
  }

  onItemsChanged(items) {
    const { milestone } = this.state;
    milestone.items = items;
    this.setState({ milestone });
  }

  setImage(image) {
    const { milestone } = this.state;
    milestone.image = image;
  }

  changeSelectedFiat(fiatType) {
    const { milestone } = this.state;
    milestone.fiatType = fiatType;
    this.setState({ milestone });
  }

  toggleFormValid(formState) {
    if (this.state.milestone.itemizeState) {
      this.setState(prevState => ({
        formIsValid: formState && prevState.milestone.items.length > 0,
      }));
    } else {
      this.setState({ formIsValid: formState });
    }
  }

  checkUser() {
    if (!this.props.currentUser) {
      this.props.history.push('/');
      return Promise.reject("Not allowed. No user logged in");
    }

    if(!this.props.isCampaignManager){
      this.props.history.push('/');
      return Promise.reject("Not allowed. User is not able to create milestones");
    }

    return authenticateIfPossible(this.props.currentUser)
      .then(() => {
        if (
          this.props.isNew &&
          !this.props.isProposed &&
          !this.props.isCampaignManager/* (this.props.currentUser) */
        ) {
          throw new Error('not whitelisted');
        }
      })
      .then(() => checkProfile(this.props.currentUser));
  }

  toggleItemize() {
    const { milestone } = this.state;
    milestone.itemizeState = !milestone.itemizeState;
    this.setState({ milestone });
  }

  toggleAddMilestoneItemModal() {
    this.setState(prevState => ({
      addMilestoneItemModalVisible: !prevState.addMilestoneItemModalVisible,
    }));
  }

  submit() {
    const { milestone } = this.state;

    milestone.managerAddress = this.state.campaign.managerAddress;
    milestone.campaignReviewerAddress = this.state.campaign.reviewerAddress;
    milestone.campaignId = this.state.campaign.id;
    /*milestone.status =
      this.props.isProposed || milestone.status === Milestone.REJECTED
        ? Milestone.PROPOSED
        : milestone.status; // make sure not to change status!*/
    milestone.status = Milestone.PENDING;

    this.setState(
      {
        isSaving: true,
        isBlocking: false,
      },
      () => {

        // Save the milestone
        this.props.addMilestone(milestone);
        
        React.toast.success(
          <p>
            Your Milestone has been saved!
            <br />
          </p>,
        );
        GA.trackEvent({
          category: 'Milestone',
          action: 'updated',
          label: this.state.id,
        });
        this.setState({
          isSaving: false,
          isBlocking: false,
        });
        this.props.history.goBack();
      },
    );
  }

  mapInputs(inputs) {
    const { milestone } = this.state;
    milestone.title = inputs.title;
    milestone.description = inputs.description;
    milestone.reviewerAddress = inputs.reviewerAddress;
    milestone.recipientAddress = inputs.recipientAddress;
    milestone.fiatAmountTarget = FiatUtils.dollarToCent(new BigNumber(inputs.fiatAmountTarget));
    // if(!milestone.itemizeState) milestone.maxAmount = inputs.maxAmount;
    this.setState({ milestone });
  }

  removeItem(index) {
    const { milestone } = this.state;
    delete milestone.items[index];
    milestone.items = milestone.items.filter(() => true);
    this.setState({ milestone });
  }

  btnText() {
    if (this.props.isNew) {
      return this.props.isProposed ? 'Propose Milestone' : 'Create Milestone';
    }
    return 'Update Milestone';
  }

  addItem(item) {
    const { milestone } = this.state;
    milestone.items = milestone.items.concat(item);
    this.setState({ milestone });
  }

  triggerRouteBlocking() {
    const form = this.form.current.formsyForm;
    // we only block routing if the form state is not submitted
    this.setState({ isBlocking: form && (!form.state.formSubmitted || form.state.isSubmitting) });
  }

  render() {
    // TODO Temporal hasta que los combos se carguen con las opciones.
    const reviewers = ['0x36d1d3c43422EF3B1d7d23F20a25977c29BC3f0e'];
    const { isNew, isProposed, history, fiatTypes/*, reviewers*/ } = this.props;
    const { isLoading, isSaving, formIsValid, campaign, isBlocking, milestone } = this.state;

    return (
      <div id="edit-milestone-view">
        <div className="container-fluid page-layout edit-view">
          <div>
            <div className="col-md-8 m-auto">
              {isLoading && <Loader className="fixed" />}

              {!isLoading && (
                <div>
                  <GoBackButton history={history} title={`Campaign: ${campaign.title}`} />

                  <div className="form-header">
                    {isNew && !isProposed && <h3>Add a new milestone</h3>}

                    {!isNew && !isProposed && (
                      <h3>
                        Edit milestone
                        {milestone.title}
                      </h3>
                    )}

                    {isNew && isProposed && <h3>Propose a Milestone</h3>}

                    <h6>
                      Campaign: <strong>{getTruncatedText(campaign.title, 100)}</strong>
                    </h6>

                    <p>
                      <i className="fa fa-question-circle" />A Milestone is a single accomplishment
                      within a project. In the end, all donations end up in Milestones. Once your
                      Milestone is completed, you can request a payout.
                    </p>

                    {isProposed && (
                      <p>
                        <i className="fa fa-exclamation-triangle" />
                        You are proposing a Milestone to the Campaign Owner. The Campaign Owner can
                        accept or reject your Milestone
                      </p>
                    )}
                  </div>

                  <Form
                    id="edit-milestone-form"
                    onSubmit={this.submit}
                    ref={this.form}
                    mapping={inputs => this.mapInputs(inputs)}
                    onValid={() => this.toggleFormValid(true)}
                    onInvalid={() => this.toggleFormValid(false)}
                    onChange={e => this.triggerRouteBlocking(e)}
                    layout="vertical"
                  >
                    <Prompt
                      when={isBlocking}
                      message={() =>
                        `You have unsaved changes. Are you sure you want to navigate from this page?`
                      }
                    />

                    <Input
                      name="title"
                      label="What are you going to accomplish in this Milestone?"
                      id="title-input"
                      type="text"
                      value={milestone.title}
                      placeholder="E.g. buying goods"
                      help="Describe your Milestone in 1 sentence."
                      validations="minLength:3"
                      validationErrors={{
                        minLength: 'Please provide at least 3 characters.',
                      }}
                      required
                      autoFocus
                    />
                    <div className="form-group">
                      <QuillFormsy
                        name="description"
                        label="Explain how you are going to do this successfully."
                        helpText="Make it as extensive as necessary. Your goal is to build trust, so that people donate Ether to your Campaign. Don't hesitate to add a detailed budget for this Milestone"
                        value={milestone.description}
                        placeholder="Describe how you're going to execute your Milestone successfully..."
                        help="Describe your Milestone."
                        required
                      />
                    </div>

                    <div className="form-group">
                      <FormsyImageUploader
                        setImage={this.setImage}
                        previewImage={milestone.image}
                        required={isNew}
                      />
                    </div>

                    <div className="form-group">
                      <SelectFormsy
                        name="reviewerAddress"
                        id="reviewer-select"
                        label="Select a reviewer"
                        helpText="Each milestone needs a reviewer who verifies that the milestone is
                          completed successfully"
                        value={milestone.reviewerAddress}
                        cta="--- Select a reviewer ---"
                        options={reviewers}
                        validations="isEtherAddress"
                        validationErrors={{
                          isEtherAddress: 'Please select a reviewer.',
                        }}
                        //required
                        disabled={!isNew && !isProposed}
                      />
                    </div>
                    <div className="label">Where will the money go after completion? *</div>
                    <div className="form-group recipient-address-container">
                      <Input
                        name="recipientAddress"
                        id="title-input"
                        type="text"
                        value={milestone.recipientAddress}
                        placeholder="0x0000000000000000000000000000000000000000"
                        help="Enter a RSK address."
                        validations="isEtherAddress"
                        validationErrors={{
                          isEtherAddress: 'Please insert a valid RSK address.',
                        }}
                        required
                        disabled={milestone.projectId !== undefined}
                      />
                    </div>

                    <div className="card milestone-items-card">
                      <div className="card-body">
                        <div className="form-group row">
                          <div className="col-6">
                            <Input
                              name="fiatAmountTarget"
                              min="0"
                              id="fiataAmountTarget-input"
                              type="number"
                              step="any"
                              label={`Target amount in ${milestone.fiatType}`}
                              value={milestone.fiatAmountTarget}
                              placeholder="10"
                              validations="greaterThan:0"
                              validationErrors={{
                                greaterEqualTo: 'Minimum value must be greater than 0',
                              }}
                            />
                          </div>

                          <div className="col-6">
                            <SelectFormsy
                              name="fiatType"
                              label="Currency"
                              value={milestone.fiatType}
                              options={fiatTypes}
                              onChange={this.changeSelectedFiat}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-6">
                        <GoBackButton history={history} title={`Campaign: ${campaign.title}`} />
                      </div>
                      <div className="col-6">
                        <LoaderButton
                          className="btn btn-success pull-right"
                          formNoValidate
                          type="submit"
                          //disabled={isSaving || !formIsValid}
                          isLoading={isSaving}
                          loadingText="Saving..."
                        >
                          <span>{this.btnText()}</span>
                        </LoaderButton>
                      </div>
                    </div>
                  </Form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EditMilestone.propTypes = {
  currentUser: PropTypes.instanceOf(User),
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  isProposed: PropTypes.bool,
  isNew: PropTypes.bool,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      milestoneId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  fiatTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  isCampaignManager: PropTypes.bool,
  reviewers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  tokenWhitelist: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

EditMilestone.defaultProps = {
  currentUser: undefined,
  isNew: false,
  isProposed: false,
};

const EdtMilestone = props => (
  <RolesListProvider>
    <RolesListConsumer>
      {({ reviewers }) => (
        <WhiteListConsumer>
          {({ state: { tokenWhitelist, fiatWhitelist } }) => (
            <EditMilestone
              {...props}
              tokenWhitelist={tokenWhitelist}
              fiatTypes={fiatWhitelist.map(f => ({ value: f, title: f }))}
              reviewers={reviewers}
              isCampaignManager={props.isCampaignManager}
            />
          )}
        </WhiteListConsumer>
      )}
    </RolesListConsumer>
  </RolesListProvider>
);


const mapStateToProps = (state, ownProps) => {
  return {
    campaign: selectCampaign(state, ownProps.match.params.id),
    isCampaignManager: isCampaignManager(state)
  }
}

const mapDispatchToProps = { addMilestone }

export default connect(mapStateToProps,mapDispatchToProps)(EdtMilestone);