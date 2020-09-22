import React,{useEffect, useState} from 'react'

const useGetVerifiedData = (scanner) => {
    const [equalPallet,setEqualPallet] = useState(false)
    const [equalMatCode,setEqualMatCode] = useState(false)
    const [equalLotNo,setEqualLotNo] = useState(false)
    const [equalQty,setEqualQty] = useState(false)
    const [verification,setVerification] = useState(false)

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
    
        if (scanner.qrCant === scanner.qty){
            setEqualQty(true)
        }

        if( scanner.qrPallet === scanner.pallet && scanner.qrCodMat === scanner.matCode && scanner.qrLot === scanner.lotNo && scanner.qrCant === scanner.qty)
            setVerification(true)
    },[])

    return {equalPallet,equalMatCode,equalLotNo,equalQty,verification}
}

export default useGetVerifiedData