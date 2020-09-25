import React,{useEffect, useState} from 'react'
import { numberChangeFormat } from '../../../helper/functions'

const useGetVerifiedData = (scanner) => {
    const [equalPallet,setEqualPallet] = useState(false)
    const [equalMatCode,setEqualMatCode] = useState(false)
    const [equalLotNo,setEqualLotNo] = useState(false)
    const [equalQty,setEqualQty] = useState(false)
    const [verification,setVerification] = useState(false)

    const qtyToEnglish = numberChangeFormat(scanner.qty)

    useEffect(() => {
        if (scanner.qrPallet === scanner.pallet){
            setEqualPallet(true)
        }
    
        if (scanner.qrCodMat === scanner.matCode){
            setEqualMatCode(true)
        }
    
        if (scanner.qrLot === scanner.lotNo){
            setEqualLotNo(true)
        }
    
        if (qtyToEnglish === scanner.qrCant){
            setEqualQty(true)
        }

        if( scanner.qrPallet === scanner.pallet && scanner.qrCodMat === scanner.matCode && scanner.qrLot === scanner.lotNo && qtyToEnglish === scanner.qrCant)
            setVerification(true)
    },[])

    return {equalPallet,equalMatCode,equalLotNo,equalQty,verification}
}

export default useGetVerifiedData