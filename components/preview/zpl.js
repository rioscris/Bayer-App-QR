import { Alert } from "react-native";

export const useGetZPL = (pallet, lot, man) => {
    let matCode, lotNo, qty;
    if (man) {
        matCode = lot.matCode;
        lotNo = lot.lotNo.trim().toUpperCase();
        qty = lot.qty;
    }
    else {
        const { matCodeParsed, lotNoParsed, qtyParsed } = getLotFields(lot);
        matCode = matCodeParsed;
        lotNo = lotNoParsed
        qty = qtyParsed
    }

    return `^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR6,6~SD15^JUS^LRN^CI0^XZ
    ^XA
    ^MMT
    ^PW799
    ^LL0519
    ^LS0
    ^BY198,198^FT435,385^BXN,9,200,0,0,1,~
    ^FH\\^FD\\7E192${pallet}\\7E1240${matCode}\\7E110${lotNo}\\7E137${qty}^FS
    ^PQ1,0,1,Y^XZ
    `;
};


const getLotFields = (lot) => { //Le quite la validacion
    let matCodeParsed, lotNoParsed, qtyParsed;
    matCodeParsed = lot.slice(0, 8)
    lotNoParsed = lot.slice(8, 14).trim().toUpperCase()
    qtyParsed = lot.slice(14)
    return { matCodeParsed, lotNoParsed, qtyParsed }
}

// export const getLotFields = ({lot}) => (!lot || lot.length < 22) ? {
//     matCode: '',
//     lotNo: '',
//     qty: '',
// } : {
//     matCode: lot.slice(0, 8),
//     lotNo: lot.slice(8, 14).trim().toUpperCase(),
//     qty: lot.slice(14, 17),
// }