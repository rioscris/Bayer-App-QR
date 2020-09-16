export const useGetZPL = (pallet, lotNo, qty,matCode) => {

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