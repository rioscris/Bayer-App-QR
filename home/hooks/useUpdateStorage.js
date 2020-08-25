import React from 'react'
import { useSelector } from 'react-redux';

const useUpdateStorage = () => {
    const update = useSelector(state => state.settings.update)
    return update;
}

export default useUpdateStorage;