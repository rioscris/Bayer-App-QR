export const generateQR = (pallet, lot) => {
    const {matCode, lotNo, qty} = getLotFields(lot);
    const gs1 = `00${pallet}20${matCode}10${lotNo}37${qty}`;
    return `@"CT~~CD,~CC^~CT~
        ^XA~TA000~JSN^LT0^MNW^MTD^PON^PMN^LH0,0^JMA^PR4,4~SD15^JUS^LRN^CI0^XZ
        ^XA
        ^MMT
        ^PW799
        ^LL0480
        ^LS0
        ^BY3,3,111^FT100,200^BQN,0,6Y,N
        ^FDM,${gs1}^FS
        ^PQ1,0,1,Y^XZ"`;
};

export const getLotFields = (lot) => (!lot || lot.length < 18) ? {
    matCode: '',
    lotNo: '',
    qty: '',
} : {
    matCode: lot.slice(0, 8),
    lotNo: lot.slice(8, 6),
    qty: lot.slice(14, 4),
}