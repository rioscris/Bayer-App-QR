import {SAVE_PALLET, SAVE_LOT, SCAN_CLEAR} from './action.js';

const initialState = {
    pallet: null,
    lot: null,
}

const barcodeReducer = (state = initialState, action) => {
    switch(action.type){
        case SAVE_PALLET: 
            return {
                ...state, pallet: action.payload
            }
        case SAVE_LOT: 
            return {
                ...state, lot: action.payload
            }
        case SCAN_CLEAR:
            return {
                pallet: null,
                lot: null,
            }
        default: 
            return state;
    }
}

export default barcodeReducer;