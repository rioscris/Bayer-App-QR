import {SAVE_PALLET, SAVE_LOT_AUTO, SAVE_LOT_MAN, SCAN_CLEAR} from './action.js';

const initialState = {
    pallet: null,
    lotNo: null,
    matCode:null,
    qty:null,
}

const barcodeReducer = (state = initialState, action) => {
    switch(action.type){
        case SAVE_PALLET: 
            return {
                ...state, pallet: action.payload
            }
        case SAVE_LOT_AUTO:
            return{
            ...state,
            matCode: action.payload.slice(0, 8), ///12345678  ABCDEF  1234 
            lotNo:action.payload.slice(8, 18).trim().toUpperCase(),
            qty:action.payload.slice(18),
        }
        case SAVE_LOT_MAN: 
            return {
                ...state,
                matCode: action.payload.matCode,
                lotNo: action.payload.lotNo.trim().toUpperCase(),
                qty: action.payload.qty,
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