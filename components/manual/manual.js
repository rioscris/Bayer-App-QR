import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useDispatch } from 'react-redux';
import { Camera, Check } from '../../images/';
import useScannerStorage from '../home/hooks/useScannerStorage';
import { SAVE_LOT_MAN, SAVE_PALLET } from '../scanner/action';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { Input, Text, Card } from 'react-native-elements';
import {CONFIRM_AVAILABLE, MAX_CANT_COD_MAT,MAX_CANT_LOT,MAX_CANT_PALLET,MAX_CANT_QTY,MIN_CANT_LOT} from './constants';

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
            navigation.navigate('Preview', { validate: validate });
            setPalletView(true);
        }
    }

    const maxLenght = () => {
        console.log(pallet.length + matCode.length + lotNo.length + qty.length)
        return pallet.length + matCode.length + lotNo.length + qty.length;
    }

    return (
        <ScrollView style={{ backgroundColor: "white", height: "100%" }}>
            <View>
                {palletView ?
                    <View>
                        <Card >
                            <Text style={{ paddingLeft: 10, fontSize: 20, paddingBottom: 10 }}>
                                Ingrese el numero de paleta
                    </Text>
                            <Card.Divider />
                            <Input placeholder='Numero de paleta' onChangeText={(e) => setPallet(e)} value={pallet}
                                rightIcon={pallet.length === MAX_CANT_PALLET ? <AntDesignIcon name={"checkcircle"} size={25} color="green" />
                                    : <EntypoIcon name={"circle-with-cross"} size={25} color="red" />} />
                        </Card>
                    </View>
                    :
                    <View>
                        <Card>
                            <Text style={{ paddingLeft: 10, fontSize: 20, paddingBottom: 10 }}>
                                Ingrese el codigo de material
                            </Text>
                            <Card.Divider />
                            <Input placeholder='Código de material' onChangeText={(e) => setMatCode(e)} value={matCode} 
                            rightIcon={matCode.length === MAX_CANT_COD_MAT ? <AntDesignIcon name={"checkcircle"} size={25} color="green" />
                            : <EntypoIcon name={"circle-with-cross"} size={25} color="red" />}
                            />
                            <Text style={{ paddingLeft: 10, fontSize: 20, paddingBottom: 10 }}>
                                Ingrese el número de lote
                            </Text>
                            <Card.Divider />
                            <Input placeholder='Número de lote' onChangeText={(e) => setLotNo(e)} value={lotNo} 
                            rightIcon={lotNo.length >= MIN_CANT_LOT && lotNo.length <= MAX_CANT_LOT ? <AntDesignIcon name={"checkcircle"} size={25} color="green" />
                            : <EntypoIcon name={"circle-with-cross"} size={25} color="red" />}
                            />
                            <Text style={{ paddingLeft: 10, fontSize: 20, paddingBottom: 10 }}>
                                Ingrese la cantidad
                            </Text>
                            <Card.Divider />
                            <Input placeholder='Cantidad' onChangeText={(e) => setQty(e)} value={qty} 
                            rightIcon={qty.length === MAX_CANT_QTY ? <AntDesignIcon name={"checkcircle"} size={25} color="green" />
                            : <EntypoIcon name={"circle-with-cross"} size={25} color="red" />}
                            />
                        </Card>
                    </View>
                }
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => onSubmit()} disabled={maxLenght < CONFIRM_AVAILABLE ? false : true}>
                    <AntDesignIcon name={"checkcircle"} size={55} color="green" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { marginLeft: 20 }]} onPress={() => {
                    navigation.goBack();
                }}>
                    <Image style={[styles.image, { tintColor: '#ffb13d' }]} source={Camera} />
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