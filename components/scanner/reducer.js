import { QR_CLEAR, SAVE_DATA_QR, SAVE_LOT_AUTO, SAVE_LOT_MAN,SAVE_PALLET, SCAN_CLEAR } from './action.js';

const initialState = {
  pallet: null,
  matCode: null,
  lotNo: null,
  qty: null,
  qrPallet: null,
  qrLot: null,
  qrCant: null,
  qrCodMat: null,
};

const barcodeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_PALLET:
      return {
        ...state,
        pallet: action.payload,
      };
    case SAVE_LOT_AUTO:
      return {
        ...state,
        matCode: action.payload.slice(0, 8), ///12345678  ABCDEF  1234
        lotNo: action.payload.slice(8, 18).trim().toUpperCase(),
        qty: action.payload.slice(18),
      };
    case SAVE_LOT_MAN:
      return {
        ...state,
        matCode: action.payload.matCode,
        lotNo: action.payload.lotNo.trim().toUpperCase(),
        qty: action.payload.qty,
      };
    case SCAN_CLEAR:
      return {
        ...state,
        pallet: null,
        qrPallet: null,
        qrLot: null,
        qrCant: null,
        qrCodMat: null,
        matCode: null,
        lotNo: null,
        qty:null
      };
    case QR_CLEAR:
      return {
        ...state,
        qrPallet: null,
        qrLot: null,
        qrCant: null,
        qrCodMat: null,
      };
    case SAVE_DATA_QR:
      const groups = action.payload.split(String.fromCharCode(29));
      const palletGS = "92";
      const matGS = "240";
      const lotGS = "10";
      const qtyGS = "37";
      const ix = [null, 'pallet', 'mat', 'lot', 'qty']
      return {
        ...state,
        qrPallet: groups[ix.indexOf('pallet')].split(palletGS).pop(), 
        qrCodMat: groups[ix.indexOf('mat')].split(matGS).pop(),
        qrLot: groups[ix.indexOf('lot')].split(lotGS).pop().trim(),
        qrCant: groups[ix.indexOf('qty')].split(qtyGS).pop(),
      };
    default:
      return state;
  }
};

export default barcodeReducer;
