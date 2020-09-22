import React from 'react'
import { useSelector } from 'react-redux';


const useGetDataToValidate = () => {
    const state = useSelector(state => state.scanner)
    return state
}
export default useGetDataToValidate;
