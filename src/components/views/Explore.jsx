import React from 'react';
/*import DACs from './DACs';*/
import Campaigns from './Campaigns';
import Milestones from './Milestones';
import JoinGivethCommunity from '../JoinGivethCommunity';
import ConnectionBanner from "@rimble/connection-banner";

const Explore = ({ history }) => (
  <div>
    <JoinGivethCommunity history={history} />
    {/*<DACs />*/}
    <Campaigns />
    {/*<Milestones />*/}
    <ConnectionBanner
      currentNetwork={1}
      requiredNetwork={33}
      onWeb3Fallback={false}
    />
  </div>
);

Explore.propTypes = {};


export default Explore