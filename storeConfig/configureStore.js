import {createStore,combineReducers} from 'redux'
import settingsReducer from '../components/settings/reducer'
import scannerReducer from '../components/scanner/reducer'

const rootReducer = combineReducers({
    settings: settingsReducer,
    scanner: scannerReducer,
})

const configureStore = () => {
    const store = createStore(rootReducer);
    return store
}

export default configureStore;