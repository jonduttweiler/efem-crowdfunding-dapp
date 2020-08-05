import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import CommunityButton from './CommunityButton';
import User from '../models/User';

import { connect } from 'react-redux';
import { isDelegate, isCampaignManager } from '../redux/reducers/userSlice';

import OnlyRole from '../components/OnlyRole';

import { CREATE_DAC_ROLE, CREATE_CAMPAIGN_ROLE } from "../constants/Role";


/**
 * The join Giveth community top-bar
 */
class JoinGivethCommunity extends Component {
  constructor(props) {
    super(props);

    this.createDAC = this.createDAC.bind(this);
    this.createCampaign = this.createCampaign.bind(this);
  }

  createDAC() {
    if (!this.props.isDelegate) {
      React.swal({
        title: 'Sorry, this Dapp is in beta...',
        content: React.swal.msg(
          <p>
            It&#8217;s great to see that you want to start a Decentralized Fund. However, this Dapp
            is still in beta and we only allow a select group of people to start Funds
            <br />
            Please <strong>contact us on our Slack</strong>, or keep browsing
          </p>,
        ),
        icon: 'info',
        buttons: [false, 'Got it'],
      });
      return;
    }

    if (this.props.currentUser) {
      this.props.history.push('/dacs/new');
    } else {
      React.swal({
        title: "You're almost there...",
        content: React.swal.msg(
          <p>
            It&#8217;s great to see that you want to start a Decentralized Fund. To get started,
            please sign up (or sign in) first.
          </p>,
        ),
        icon: 'info',
        buttons: ['Cancel', 'Sign up now!'],
      }).then(isConfirmed => {
        if (isConfirmed) this.props.history.push('/signup');
      });
    }
  }

  createCampaign() {
    if (!this.props.isCampaignManager) {
      React.swal({
        title: 'Sorry, this Dapp is in beta...',
        content: React.swal.msg(
          <p>
            It&#8217;s great to see that you want to start a campaign, however, this Dapp is still
            in beta and we only allow a select group of people to start campaigns
            <br />
            Please <strong>contact us on our Slack</strong>, or keep browsing
          </p>,
        ),
        icon: 'info',
        buttons: [false, 'Got it'],
      });
      return;
    }
    if (this.props.currentUser) {
      this.props.history.push('/campaigns/new');
    } else {
      React.swal({
        title: "You're almost there...",
        content: React.swal.msg(
          <p>
            It&#8217;s great to see that you want to start a campaign. To get started, please sign
            up (or sign in) first.
          </p>,
        ),
        icon: 'info',
        buttons: ['Cancel', 'Sign up now!'],
      }).then(isConfirmed => {
        if (isConfirmed) this.props.history.push('/signup');
      });
    }
  }

  render() {
    return (
      <div
        id="join-giveth-community"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/img/hero.jpeg)` }}
      >
        <div className="vertical-align">
          <center>
            <h3><br /></h3>
            <OnlyRole role={CREATE_DAC_ROLE}>
              <button type="button" className="btn btn-info" onClick={() => this.createDAC()}>
                Create a Fund
              </button>
            </OnlyRole>
            <OnlyRole role={CREATE_CAMPAIGN_ROLE}>
              <button type="button" className="btn btn-info" onClick={() => this.createCampaign()}>
                Start a Campaign
              </button>
            </OnlyRole>
          </center>
        </div>
      </div>
    );
  }
}

JoinGivethCommunity.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  currentUser: PropTypes.instanceOf(User),
  isDelegate: PropTypes.bool,
  isCampaignManager: PropTypes.bool,
};

JoinGivethCommunity.defaultProps = {
  currentUser: undefined,
};





const mapStateToProps = (state, props) => ({
  isDelegate: isDelegate(state),
  isCampaignManager: isCampaignManager(state)
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(JoinGivethCommunity);