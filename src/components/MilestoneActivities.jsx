import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import { Form } from 'formsy-react-components';
import Milestone from 'models/Milestone';
import BigNumber from 'bignumber.js';
import ProfileCard from './ProfileCard';
import MilestoneProof from './MilestoneProof';
import MilestoneConversationAction from 'components/MilestoneConversationAction';
import Loader from './Loader';
import Activity from '../models/Activity';
import DateTimeViewer from './DateTimeViewer';

class MilestoneActivities extends Component {

  constructor() {
    super();
    this.state = {
      activities: {},
      isLoading: false,
      etherScanUrl: '',
    };
  }

  render() {
    const { isLoading } = this.state;
    const { milestone, activities } = this.props;

    return (
      <div id="milestone-activities">
        {isLoading && <Loader className="fixed" />}
        {!isLoading && (
          <div className="card">
            <div className="card-body content">
              {activities.map(a => (
                <div key={a.id}>
                  <ProfileCard address={a.userAddress} namePosition="right"/>
                  <div className="content-wrapper">
                    <div className="c-timestamp">
                      <DateTimeViewer value={a.createdAt}/>
                    </div>
                    <div className="c-action">{a.action}</div>
                    <div className="c-message">{ReactHtmlParser(a.message)}</div>
                    {a.items && a.items.length > 0 && (
                      <Form className="items-form">
                        <strong>Attachments</strong>
                        <MilestoneProof items={a.items} isEditMode={false} />
                      </Form>
                    )}
                    {/* ---- action buttons ---- */}
                    <div className="c-action-footer">
                      <MilestoneConversationAction
                        messageContext={a.messageContext}
                        milestone={milestone}
                      />
                    </div>
                    <div className="c-divider" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

MilestoneActivities.propTypes = {
  activities: PropTypes.arrayOf(PropTypes.instanceOf(Activity)).isRequired,
  milestone: PropTypes.instanceOf(Milestone).isRequired,
  balance: PropTypes.instanceOf(BigNumber).isRequired,
};

export default MilestoneActivities;
