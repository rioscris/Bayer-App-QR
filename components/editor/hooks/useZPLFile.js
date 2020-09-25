import React from 'react'
import { numberChangeFormat } from '../../../helper/functions';
import { FILE_NAME, TAGS, ZPL_DEFAULT } from '../../preview/zpl';

const RNFS = require('react-native-fs');

const useZPLFile = () => {
    return {
        getFileContent: () => RNFS.readFile(RNFS.DocumentDirectoryPath + '/' + FILE_NAME),
        saveFileContent: (content) => RNFS.unlink(RNFS.DocumentDirectoryPath + '/' + FILE_NAME).then(() => { RNFS.writeFile(RNFS.DocumentDirectoryPath + '/' + FILE_NAME, content) }),
        initFile: () => {
            RNFS.readDir(RNFS.DocumentDirectoryPath).then((dir) => {
                const found = dir.find(file => file.name === FILE_NAME);
                if(!found){
                    RNFS.writeFile(RNFS.DocumentDirectoryPath + '/' + FILE_NAME, ZPL_DEFAULT);
                }
            })
        },
        getZPL: (pallet, matCode, lotNo, qty) => new Promise((resolve, reject) => {
            const newQty = numberChangeFormat(qty);
            RNFS.readFile(RNFS.DocumentDirectoryPath + '/' + FILE_NAME).then(content => {
                resolve(content
                    .replace(TAGS.PALLET, pallet)
                    .replace(TAGS.MATCODE, matCode)
                    .replace(TAGS.LOTNO, lotNo)
                    .replace(TAGS.QTY, newQty));
            }).catch((error) => reject(error))
        }),
    }
}

export default useZPLFile;