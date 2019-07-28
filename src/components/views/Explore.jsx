import React from 'react';

import { Consumer as UserConsumer } from '../../contextProviders/UserProvider';
import { history } from '../../lib/helpers';
import DACs from './DACs';
import Campaigns from './Campaigns';
import Milestones from './Milestones';

import JoinGivethCommunity from '../JoinGivethCommunity';

const Explore = () => (
  <div>
    <UserConsumer>
      {({ state: { currentUser } }) => (
        <JoinGivethCommunity currentUser={currentUser} history={history} />
      )}
    </UserConsumer>

    <DACs />
    <Campaigns />
    <Milestones />
  </div>
);

Explore.propTypes = {};

export default Explore;
