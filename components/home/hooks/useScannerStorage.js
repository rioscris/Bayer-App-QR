import React from 'react'
import { useSelector } from 'react-redux';

const useScannerStorage = () => {
    const scanner = useSelector(state => state.scanner)
    return scanner;
}

export default useScannerStorage;