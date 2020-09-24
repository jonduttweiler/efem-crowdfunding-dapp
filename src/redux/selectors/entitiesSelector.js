import { createSelector } from 'reselect'
import Entity from '../../models/Entity';

const dacSelect = (state, props) => state.dacs.find(e => e.id === props.entityId);
const campaignSelect = (state, props) => state.campaigns.find(e => e.id === props.entityId);
const milestoneSelect = (state, props) => state.milestones.find(e => e.id === props.entityId);

const makeEntitySelect = () => {
  return createSelector(
    [dacSelect, campaignSelect, milestoneSelect],
    (dac, campaign, milestone) => {
      console.log('makeEntitySelect', dac, campaign, milestone);
      if (dac) {
        return new Entity(dac);
      }
      if (campaign) {
        return new Entity(campaign);
      }
      if (milestone) {
        return new Entity(milestone);
      }
      return undefined;
    }
  )
}

export default makeEntitySelect;