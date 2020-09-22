import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useDispatch } from 'react-redux';
import { Camera, Check } from '../../images/';
import useScannerStorage from '../home/hooks/useScannerStorage';
import { SAVE_LOT_MAN, SAVE_PALLET, SCAN_CLEAR } from '../scanner/action';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { Input, Text, Card, Button } from 'react-native-elements';
import { CONFIRM_AVAILABLE, MAX_CANT_COD_MAT, MAX_CANT_LOT, MAX_CANT_PALLET, MAX_CANT_QTY, MIN_CANT_LOT } from './constants';

const Manual = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const scannerStorage = useScannerStorage();
    const { validate } = route.params;
    const [palletView, setPalletView] = useState(true);
    const [pallet, setPallet] = useState(""); //todo este state, podria estar en uno solo?
    const [matCode, setMatCode] = useState("");
    const [lotNo, setLotNo] = useState("");
    const [qty, setQty] = useState("");

    useEffect(() => {
        if (scannerStorage.pallet) {
            setPallet(scannerStorage.pallet);
            setPalletView(false);
        }
    }, [])

    const onSubmit = () => { //Hacer un solo dispatch.
        if (palletView) {
            if (pallet.length >= MAX_CANT_PALLET) {
                dispatch({ type: SAVE_PALLET, payload: pallet });
                setPalletView(false);
            } else {
                alert("El número de paleta es inválido.");
            }
        }
        else {
            const allLot = pallet.length + matCode.length + lotNo.length + qty.length;
            if(allLot >= CONFIRM_AVAILABLE){
                dispatch({ type: SAVE_LOT_MAN, payload: { matCode, lotNo, qty } });
                navigation.navigate('Visualizacion', { validate: validate });
                setPalletView(true);
            } else{
                alert("Los datos ingresados no son correctos.")
            }
        }
    }

    return (
        <ScrollView style={styles.body}>
            <View>
                {palletView ?
                    <View>
                        <Card >
                            <Text style={styles.textView}>
                                Ingrese el numero de paleta
                            </Text>
                            <Card.Divider />
                            <Input placeholder='Numero de paleta' onChangeText={(e) => setPallet(e)} value={pallet} keyboardType="numeric"
                                rightIcon={pallet.length >= MAX_CANT_PALLET ? <AntDesignIcon name={"checkcircle"} size={25} color="green" />
                                    : <EntypoIcon name={"circle-with-cross"} size={25} color="red" />} />
                        </Card>
                    </View>
                    :
                    <View>
                        <Card>
                            <Text style={styles.textView}>
                                Ingrese el codigo de material
                            </Text>
                            <Card.Divider />
                            <Input placeholder='Código de material' onChangeText={(e) => setMatCode(e)} value={matCode}  keyboardType="numeric"
                                rightIcon={matCode.length === MAX_CANT_COD_MAT ? <AntDesignIcon name={"checkcircle"} size={25} color="green" />
                                    : <EntypoIcon name={"circle-with-cross"} size={25} color="red" />}
                            />
                            <Text style={styles.textView}>
                                Ingrese el número de lote
                            </Text>
                            <Card.Divider />
                            <Input placeholder='Número de lote' onChangeText={(e) => setLotNo(e)} value={lotNo}
                                rightIcon={lotNo.length >= MIN_CANT_LOT && lotNo.length <= MAX_CANT_LOT ? <AntDesignIcon name={"checkcircle"} size={25} color="green" />
                                    : <EntypoIcon name={"circle-with-cross"} size={25} color="red" />}
                            />
                            <Text style={styles.textView}>
                                Ingrese la cantidad
                            </Text>
                            <Card.Divider />
                            <Input placeholder='Cantidad' onChangeText={(e) => setQty(e)} value={qty} keyboardType="numeric"
                                rightIcon={qty.length === MAX_CANT_QTY ? <AntDesignIcon name={"checkcircle"} size={25} color="green" />
                                    : <EntypoIcon name={"circle-with-cross"} size={25} color="red" />}
                            />
                        </Card>
                    </View>
                }
            </View>
            <View style={styles.buttonContainer}>
                <View style={{paddingLeft:10, width:"40%"}}>
                    <Button title={"Cancelar"} 
                    buttonStyle={{backgroundColor:'#DB3834'}}
                    onPress={() => {  
                        dispatch({type : SCAN_CLEAR})
                        navigation.navigate("Menu")
                }}/>
                </View>
                <View style={{paddingLeft:30, width:"45%"}} >
                    <Button onPress={onSubmit} title={"Confirmar"} buttonStyle={{backgroundColor:'#00C18A'}}/>
                </View>
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
    textView:{
        paddingLeft: 10, 
        fontSize: 20, 
        paddingBottom: 10
    },
    body:
    { 
        backgroundColor: "white", 
        height: "100%" 
    }
});

export default Manual;