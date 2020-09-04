export const generateQR = (pallet, lot) => {

    // pallet = 1234
    // lot = 12345678ABCDEF1234

    // const {matCode, lotNo, qty} = getLotFields(lot);
    const pallet = 50000000001;
    const matCode = 80108274;
    const lot = 'ARACJ4';
    const qty = 6720;

    // const zpl = 
    // `^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR6,6~SD15^JUS^LRN^CI0^XZ
    // ^XA
    // ^MMT
    // ^PW799
    // ^LL0519
    // ^LS0
    
    // ^BY198,198^FT435,385^BXN,9,200,0,0,1,~
    // ^FH\\^FD\\7E192${pallet}\\7E1240${matCode}\\7E110${lot}\\7E137${qty}^FS
    // ^PQ1,0,1,Y^XZ
    // `;

    const zpl = 
    `^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR6,6~SD15^JUS^LRN^CI0^XZ
    ^XA
    ^MMT
    ^PW799
    ^LL0519
    ^LS0
    
    ^BY198,198^FT435,385^BXN,9,200,0,0,1,~
    ^FH\\^FD\\7E19250000000001\\7E124080108274\\7E110ARACJ4\\7E1376720^FS
    ^PQ1,0,1,Y^XZ
    `;

    return zpl;
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