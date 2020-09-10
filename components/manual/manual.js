import React, { useState, useEffect } from 'react'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import useScannerStorage from '../home/hooks/useScannerStorage';
import { View, Image, StyleSheet } from 'react-native';
import { getLotFields } from '../preview/zpl';
import { SAVE_PALLET, SAVE_LOT_MAN } from '../scanner/action';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Check, Camera } from '../../images/';

const Manual = (props) => {
    const dispatch = useDispatch();
    const scannerStorage = useScannerStorage();
    const { navigation } = props;
    const [palletView, setPalletView] = useState(true);
    const [pallet, setPallet] = useState(null); //todo este state, podria estar en uno solo?
    const [matCode, setMatCode] = useState(null);
    const [lotNo, setLotNo] = useState(null);
    const [qty, setQty] = useState(null);

    useEffect(() => {
        if(scannerStorage.pallet){
            setPallet(scannerStorage.pallet);
            setPalletView(false);
        }
    }, [])



    const onSubmit = () => { //Hacer un solo dispatch.
        if(palletView){
            dispatch({type: SAVE_PALLET, payload: pallet});
            setPalletView(false);
        }
        else{
            dispatch({type: SAVE_LOT_MAN, payload: {matCode, lotNo, qty}});
            navigation.replace('Preview');
            setPalletView(true);
        }
    }

    return (
        <ScrollView>
            <View>
                {palletView ? 
                    <TextInput style={styles.field} placeholder='Numero de paleta' onChangeText={(e) => setPallet(e)} value={pallet}/>
                : 
                    <>
                        <TextInput style={styles.field} placeholder='Código de material' onChangeText={(e) => setMatCode(e)} value={matCode}/>
                        <TextInput style={styles.field} placeholder='Número de lote' onChangeText={(e) => setLotNo(e)} value={lotNo}/>
                        <TextInput style={styles.field} placeholder='Cantidad' onChangeText={(e) => setQty(e)} value={qty}/>
                    </>
                }
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, 
                    !((palletView && pallet) || (!palletView && matCode && lotNo && qty)) ? // If no data is present
                    {borderColor: 'lightgray'} : {borderColor: '#2196F3'}]} 
                    onPress={() => onSubmit()} disabled={!((palletView && pallet) || (!palletView && matCode && lotNo && qty))}>
                    <Image style={[styles.image,
                        !((palletView && pallet) || (!palletView && matCode && lotNo && qty)) ? // If no data is present
                        {tintColor: 'lightgray'} : {tintColor: '#2196F3'}
                        ]} source={Check}/>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, {marginLeft: 20}]} onPress={() => {
                    navigation.goBack();
                }}>
                    <Image style={[styles.image, {tintColor: '#ffb13d'}]} source={Camera}/>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: "center", 
        justifyContent: "center", 
        padding: 10,
        flex: 1,
        flexDirection: "row",
    },
    field: {
        margin: "5%",
        backgroundColor: "#cedee0",
        height: 70,
        borderRadius: 20,
        fontFamily: "Helvetica, Arial, sans-serif;",
        paddingHorizontal: 25,
        marginBottom: 15,
        fontSize: 20,
        color: Colors.black,
    },
    button: {
        borderWidth: 5,
        borderColor: '#fafafa',
        // padding: 5, 
        backgroundColor: '#f2f2f2', 
        borderRadius: 50, 
        elevation: 10, 
        shadowColor: "#000", 
        shadowOpacity: 1, 
        shadowRadius: 5,
    },
    image: {
        width: 60, 
        height: 60, 
        margin: 10,
    }
});

export default Manual;