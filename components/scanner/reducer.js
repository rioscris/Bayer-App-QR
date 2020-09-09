import {SAVE_PALLET, SAVE_LOT_AUTO, SAVE_LOT_MAN, SCAN_CLEAR} from './action.js';

const initialState = {
    pallet: null,
    lot: null,
    man: false,
}

const barcodeReducer = (state = initialState, action) => {
    switch(action.type){
        case SAVE_PALLET: 
            return {
                ...state, pallet: action.payload
            }
        case SAVE_LOT_AUTO: 
            return {
                ...state, lot: action.payload, man: false,
            }
        case SAVE_LOT_MAN: 
            return {
                ...state, lot: action.payload, man: true,
            }
        case SCAN_CLEAR:
            return {
                pallet: null,
                lot: null,
                man: false,
            }
        default: 
            return state;
    }
}

export default barcodeReducer;