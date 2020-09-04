import {createStore,combineReducers} from 'redux'
import settingsReducer from '../settings/reducer'

const rootReducer = combineReducers({
    settings: settingsReducer,
})

const configureStore = () => {
    const store = createStore(rootReducer);
    return store
}

export default configureStore;