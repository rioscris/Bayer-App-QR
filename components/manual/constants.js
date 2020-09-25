import { RNCamera } from 'react-native-camera';
export const MAX_CANT_PALLET = 11
export const MAX_CANT_COD_MAT = 8
export const MAX_CANT_LOT = 10
export const MIN_CANT_LOT = 6
export const MAX_CANT_QTY = 4
export const MIN_CANT_QTY = 3
export const CONFIRM_AVAILABLE = 29
export const MaskDefaults = {
    qr: {
        portrait: {
            h: 1,
            w: 0.5,
        },
        landscape: {
            h: 1,
            w: 0.5,
        }
    },
    barcode: {
        portrait: {
            h: 1,
            w: 0.1,
        },
        landscape: {
            h: 0.3,
            w: 1,
        }
    },
};
export const defaultBarcodeTypes = [RNCamera.Constants.BarCodeType.code128];
export const defaultQrCodeTypes = [RNCamera.Constants.BarCodeType.datamatrix];
export const MAX_SCANNER_MASK_SIZE = 0.6;