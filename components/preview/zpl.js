export const FILE_NAME = 'zpl.txt'

export const TAGS = {
    PALLET: '[PALLET]',
    MATCODE: '[MATCODE]',
    LOTNO: '[LOTNO]',
    QTY: '[QTY]',
}

export const ZPL_DEFAULT =`^XA
^BY198,198^FT59,241^BXN,9,200,0,0,1,~
^FH\\^FD\\7E191[PALLET]\\7E1240[MATCODE]\\7E110[LOTNO]\\7E193[QTY]^FS
^PQ1,0,1,Y^XZ`;