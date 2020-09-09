import {SAVE_PALLET, SAVE_LOT, SCAN_CLEAR, SAVE_DATA_QR} from './action.js';

const initialState = {
    pallet: null,
    lot: null,
    qrPallet: null,
    qrLot: null,
    qrCant: null,
    qrCodMat: null,
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
        case SAVE_DATA_QR:
            return {
            ...state,                               
            qrPallet: action.payload.slice(3,14),  //[9250000000001[24080108274[10ARACJ4[376720"
            qrCodMat:action.payload.slice(18,26),
            qrLot: action.payload.slice(29,35),
            qrCant: action.payload.slice(38),
            }
        default: 
            return state;
    }
}

export default barcodeReducer;