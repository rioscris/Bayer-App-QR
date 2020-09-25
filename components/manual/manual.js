import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Input, Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { useDispatch } from 'react-redux';
import useScannerStorage from '../home/hooks/useScannerStorage';
import { SAVE_LOT_MAN, SAVE_PALLET, SCAN_CLEAR } from '../scanner/action';

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
            dispatch({ type: SAVE_PALLET, payload: pallet });
            setPalletView(false);
        }
        else {
            dispatch({ type: SAVE_LOT_MAN, payload: { matCode, lotNo, qty } });
            navigation.navigate('Visualización', { validate: validate });
            setPalletView(true);
        }
    }

    return (
        <ScrollView style={styles.body}>
            <View>
                {palletView ?
                    <View>
                        <Card >
                            <Text style={styles.textView}>
                                Ingrese el número de paleta
                            </Text>
                            <Card.Divider />
                            <Input placeholder='Número de paleta' onChangeText={(e) => setPallet(e)} value={pallet} keyboardType="numeric"
                                rightIcon={pallet ? <AntDesignIcon name={"checkcircle"} size={25} color="green" />
                                    : <EntypoIcon name={"circle-with-cross"} size={25} color="red" />} />
                        </Card>
                    </View>
                    :
                    <View>
                        <Card>
                            <Text style={styles.textView}>
                                Ingrese el código de material
                            </Text>
                            <Card.Divider />
                            <Input placeholder='Código de material' onChangeText={(e) => setMatCode(e)} value={matCode}  keyboardType="numeric"
                                rightIcon={matCode ? <AntDesignIcon name={"checkcircle"} size={25} color="green" />
                                    : <EntypoIcon name={"circle-with-cross"} size={25} color="red" />}
                            />
                            <Text style={styles.textView}>
                                Ingrese el número de lote
                            </Text>
                            <Card.Divider />
                            <Input placeholder='Número de lote' onChangeText={(e) => setLotNo(e)} value={lotNo}
                                rightIcon={lotNo ? <AntDesignIcon name={"checkcircle"} size={25} color="green" />
                                    : <EntypoIcon name={"circle-with-cross"} size={25} color="red" />}
                            />
                            <Text style={styles.textView}>
                                Ingrese la cantidad
                            </Text>
                            <Card.Divider />
                            <Input placeholder='Cantidad' onChangeText={(e) => setQty(e)} value={qty} keyboardType="numeric"
                                rightIcon={qty ? <AntDesignIcon name={"checkcircle"} size={25} color="green" />
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
                    <Button onPress={onSubmit} title={"Confirmar"} buttonStyle={{backgroundColor:'#00C18A'}} disabled={palletView ? !pallet : (!matCode || !lotNo || !qty)}/>
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