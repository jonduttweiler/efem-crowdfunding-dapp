import { applyMiddleware, compose, combineReducers, createStore } from 'redux'
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import loggerMiddleware from './middlewares/logger'
import userReducer from './reducers/userSlice.js'
import dacsReducer from './reducers/dacsSlice.js'
import campaignsReducer from './reducers/campaignsSlice.js'
import milestonesReducer from './reducers/milestonesSlice.js'
import donationsReducer from './reducers/donationsSlice.js'

import { loadUserEpic } from './epics/usersEpics';
import { fetchDacsEpic, addDacEpic } from './epics/dacsEpics';
import { fetchCampaignsEpic, addCampaignEpic } from './epics/campaignsEpics'
import { fetchMilestonesEpic, addMilestoneEpic } from './epics/milestonesEpics'
import { fetchDonationsEpic, addDonationEpic } from './epics/donationsEpics'

/**
 * Configuración del Store de Redux.
 */
export default function configureStore() {

    const rootEpic = combineEpics(
        loadUserEpic,
        fetchDacsEpic,
        addDacEpic, 
        fetchCampaignsEpic,
        addCampaignEpic,
        fetchMilestonesEpic,
        addMilestoneEpic,
        fetchDonationsEpic,
        addDonationEpic);

    const epicMiddleware = createEpicMiddleware();

    const middlewares = [loggerMiddleware, epicMiddleware]
    const middlewareEnhancer = applyMiddleware(...middlewares)

    const enhancers = [middlewareEnhancer]
    const composedEnhancers = compose(...enhancers)

    const rootReducer = combineReducers({
        user: userReducer,
        dacs: dacsReducer,
        campaigns: campaignsReducer,
        milestones: milestonesReducer,
        donations: donationsReducer        
    });

    const store = createStore(rootReducer, undefined, composedEnhancers)

    epicMiddleware.run(rootEpic);

    return store
}