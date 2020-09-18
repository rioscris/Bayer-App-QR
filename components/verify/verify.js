import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { QR_CLEAR } from '../scanner/action';
import useGetDataToValidate from './hooks/useGetDataToValidate';
import useGetVerifiedData from './hooks/useGetVerifiedData';
import ShowCompareInputs from './ShowCompareInputs';
import VerificationOverlay from './VerificationOverlay';

const Verify = ({ navigation }) => {
    const [visible, setVisible] = useState(true);
    const dispatch = useDispatch()
    const scanner = useGetDataToValidate();
    const { equalLotNo, equalMatCode, equalPallet, equalQty,verification } = useGetVerifiedData(scanner);

    useEffect(() => {
        return (() => {
            dispatch({ type: QR_CLEAR })
        })
    }, [])


    return (
        <ScrollView>
            <View styles={styles.container}>
                <ShowCompareInputs scanner={scanner} equalLotNo={equalLotNo} equalMatCode={equalMatCode} equalPallet={equalPallet} equalQty={equalQty} />
            </View>
            <VerificationOverlay setVisible={setVisible} visible={visible} verification={verification} navigation={navigation} dispatch={dispatch}/>
            <View style={styles.buttonContainer}>
                <View style={{ width: "80%", paddingTop: 10,paddingBottom:10 }}>
                    <Button title="Volver" onPress={() => navigation.popToTop()} />
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E6E9EE',
        marginHorizontal: '30',
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
    },
    buttonContainer: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
})

export default Verify;