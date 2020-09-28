import {UPDATE_STORAGE} from './action'

const initialState = {
    update: false,
}


const settingsReducer = (state = initialState,action) => {
    switch(action.type){
        case UPDATE_STORAGE:
        return {
            ...state, update: action.payload
        }
        default:
            return state;
    }
}

export default settingsReducer