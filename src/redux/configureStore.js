import { applyMiddleware, compose, combineReducers, createStore } from 'redux'
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import loggerMiddleware from './middlewares/logger'
import userReducer from './reducers/userSlice.js'
import campaignsReducer from './reducers/campaignsSlice.js'
import milestonesReducer from './reducers/milestonesSlice.js'
import { fetchCampaignsEpic, addCampaignEpic } from './epics/campaignsEpics'
import { fetchMilestonesEpic, addMilestoneEpic } from './epics/milestonesEpics'

/**
 * Configuración del Store de Redux.
 */
export default function configureStore() {

    const rootEpic = combineEpics(
        fetchCampaignsEpic,
        addCampaignEpic,
        fetchMilestonesEpic,
        addMilestoneEpic);
    const epicMiddleware = createEpicMiddleware();

    const middlewares = [loggerMiddleware, epicMiddleware]
    const middlewareEnhancer = applyMiddleware(...middlewares)

    const enhancers = [middlewareEnhancer]
    const composedEnhancers = compose(...enhancers)

    const rootReducer = combineReducers({
        user: userReducer,
        campaigns: campaignsReducer,
        milestones: milestonesReducer
    });

    const store = createStore(rootReducer, undefined, composedEnhancers)

    epicMiddleware.run(rootEpic);

    return store
}