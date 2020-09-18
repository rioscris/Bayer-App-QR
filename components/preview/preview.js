import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, NativeModules, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import useScannerStorage from '../home/hooks/useScannerStorage';
import { SCAN_CLEAR } from '../scanner/action';
import ShowDataInInputs from './ShowDataInInputs';
import { useGetZPL } from './zpl';

const Preview = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const scanner = useScannerStorage();
    const { validate } = route.params;
    const [printing, setPrinting] = useState(false);
    const [device, setDevice] = useState({});
    const zpl = useGetZPL(scanner.pallet, scanner.lotNo, scanner.qty, scanner.matCode);

    const print = () => {
        dispatch({ type: SCAN_CLEAR });
        setPrinting(true);
        Alert.alert('Imprimiendo...',
            'Enviando datos a la impresora',
            [{
                text: 'Continuar', onPress: () => {
                    NativeModules.RNZebraBluetoothPrinter.print(device.macAddress, zpl).then((res) => {
                        navigation.goBack()
                    }).catch(() => {
                        Alert.alert('Error de conexión', 'Ha ocurrido un error al imprimir', [{
                            text: 'Aceptar',
                            onPress: () => {
                                navigation.popToTop();
                            }
                        }]);
                    })
                    setPrinting(false);
                }
            }]
        );
    }

    useEffect(() => {
        AsyncStorage.getItem('@storage_print').then((json) => {
            const value = JSON.parse(json);
            setDevice(value);
        });
        return (() => {
            setDevice({})
        })
    }, []);

    return (
        <ScrollView styles={styles.container}>
            <Text h4 style={{ paddingLeft: 15,paddingTop:2 }}>
                Datos leidos
            </Text>
            <View>
                <ShowDataInInputs pallet={scanner.pallet} matCode={scanner.matCode} lotNo={scanner.lotNo} qty={scanner.qty}/>
            </View>
            <View style={styles.buttonContainer}>
                {
                    !validate ? <View style={styles.buttonContainer} >
                        <View style={{width:"45%", paddingRight:20}}>
                            <Button title={"Imprimir"} onPress={print} />
                        </View>
                        <View style={{width:"40%"}}>
                            <Button title={"Cancelar"} onPress={() => {
                                dispatch({type:SCAN_CLEAR})
                                navigation.goBack();
                                }} />
                        </View>
                    </View>
                        : <View style={{width:"80%"}}> 
                            <Button title={"Validar con QR"} onPress={() => navigation.navigate("Scanner", { validate: false, type: "qr" })} />
                        </View>
                }
            </View>
            {printing && <ActivityIndicator size='large' color='#00ff00' />}
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
    textView: {
        paddingLeft: 10,
        fontSize: 20,
        paddingBottom: 10
    },
    buttonContainer: {
        paddingTop:5,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    button: {
        backgroundColor: '#f2f2f2',
        borderRadius: 50,
        elevation: 10,
        shadowColor: "#000",
        shadowOpacity: 1,
        shadowRadius: 5,
    },
})

export default Preview;