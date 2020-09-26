import { createSelector } from 'reselect'
import Entity from '../../models/Entity';
import { selectDac } from '../reducers/dacsSlice';
import { selectCampaign } from '../reducers/campaignsSlice';
import { selectMilestone } from '../reducers/milestonesSlice';
/*
const dacSelect = (state, props) => state.dacs.find(e => e.id === props.entityId);
const campaignSelect = (state, props) => state.campaigns.find(e => e.id === props.entityId);
const milestoneSelect = (state, props) => state.milestones.find(e => e.id === props.entityId);
*/
const makeEntitySelect = () => {
  return createSelector(
    [selectDac, selectCampaign, selectMilestone],
    (dac, campaign, milestone) => {
      if (dac) {
        //return new Entity(dac);
        return dac;
      }
      if (campaign) {
        //return new Entity(campaign);
        return campaign;
      }
      if (milestone) {
        //return new Entity(milestone);
        return milestone;
      }
      return undefined;
    }
  )
}

export default makeEntitySelect;