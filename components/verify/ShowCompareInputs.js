import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Card, Input, Text } from 'react-native-elements';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {View} from 'react-native'

const ShowCompareInputs = ({ scanner, equalPallet, equalMatCode, equalLotNo, equalQty }) => {
    return (
        <Card>
            <Text style={styles.textView}>
                Número de paleta
            </Text>
            <Card.Divider />
            <Input leftIcon={<AntDesignIcon name={"barcode"} size={20}/>} value={scanner.pallet} disabled={true}
                rightIcon={equalPallet === true ? <AntDesignIcon name={"checkcircle"} size={25} color="green" />
                    : <EntypoIcon name={"circle-with-cross"} size={25} color="red" />}
            />
            <Input leftIcon={<AntDesignIcon name={"qrcode"} size={20}/>} value={scanner.qrPallet} disabled={true}
                rightIcon={equalPallet === true ? <AntDesignIcon name={"checkcircle"} size={25} color="green" />
                    : <EntypoIcon name={"circle-with-cross"} size={25} color="red" />}
            />
            <Text style={styles.textView}>
                Código de material
            </Text>
            <Card.Divider />
            <Input leftIcon={<AntDesignIcon name={"barcode"} size={20}/>} value={scanner.matCode} disabled={true}
                rightIcon={equalMatCode === true ? <AntDesignIcon name={"checkcircle"} size={25} color="green" />
                    : <EntypoIcon name={"circle-with-cross"} size={25} color="red" />}
            />
            <Input leftIcon={<AntDesignIcon name={"qrcode"} size={20}/>} value={scanner.qrCodMat} disabled={true}
                rightIcon={equalMatCode === true ? <AntDesignIcon name={"checkcircle"} size={25} color="green" />
                    : <EntypoIcon name={"circle-with-cross"} size={25} color="red" />}
            />
            <Text style={styles.textView}>
                Número de lote
            </Text>
            <Card.Divider />
            <Input leftIcon={<AntDesignIcon name={"barcode"} size={20} />} value={scanner.lotNo} disabled={true}
                rightIcon={equalLotNo === true ? <AntDesignIcon name={"checkcircle"} size={25} color="green" />
                    : <EntypoIcon name={"circle-with-cross"} size={25} color="red" />}
            />
            <Input leftIcon={<AntDesignIcon name={"qrcode"} size={20}/>} value={scanner.qrLot} disabled={true}
                rightIcon={equalLotNo === true ? <AntDesignIcon name={"checkcircle"} size={25} color="green" />
                    : <EntypoIcon name={"circle-with-cross"} size={25} color="red" />}
            />
            <Text style={styles.textView}>
                Cantidad
            </Text>
            <Card.Divider />
                <Input leftIcon={<AntDesignIcon name={"barcode"} size={20}/>} value={scanner.qty} disabled={true}
                    rightIcon={equalQty === true ? <AntDesignIcon name={"checkcircle"} size={25} color="green" />
                        : <EntypoIcon name={"circle-with-cross"} size={25} color="red" />}
                />
                <Input leftIcon={<AntDesignIcon name={"qrcode"} size={20}/>} value={scanner.qrCant} disabled={true}
                    rightIcon={equalQty === true ? <AntDesignIcon name={"checkcircle"} size={25} color="green" />
                        : <EntypoIcon name={"circle-with-cross"} size={25} color="red" />}
                />
        </Card>
    )
}

const styles = StyleSheet.create({
    textView: {
        paddingLeft: 10,
        fontSize: 20,
        paddingBottom: 5
    },
})


export default ShowCompareInputs;