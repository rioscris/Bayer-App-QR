import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { TextInput, StyleSheet, Button, Alert, View, ActivityIndicator, Image, NativeModules, Text } from 'react-native';
import useScannerStorage from '../home/hooks/useScannerStorage';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { SCAN_CLEAR } from '../scanner/action';
import { useGetZPL } from './zpl';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

const ImageButton = (tchStyle, onPress, source, imgStyle, disabled) => {
    return (
        <TouchableOpacity style={tchStyle} onPress={onPress}>
            <Image style={imgStyle} source={source} />
        </TouchableOpacity>
    )
}

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

    const printDebug = () => {
        setPrinting(true);
        dispatch({ type: SCAN_CLEAR });
        Alert.alert('Imprimiendo...',
            'Enviando datos a la impresora',
            [{
                text: 'Continuar', onPress: () => {
                    navigation.goBack();
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
    }, []);

    return (
        <ScrollView styles={styles.container}>
            <Text styles={styles.text}>
                Datos leidos
            </Text>
            <TextInput style={styles.field} editable={false} value={scanner.pallet} />
            <TextInput style={styles.field} editable={false} value={scanner.lotNo} />
            <TextInput style={styles.field} editable={false} value={scanner.qty} />
            <TextInput style={styles.field} editable={false} value={scanner.matCode} />

            <View style={styles.buttonContainer}>
                {
                    !validate ? <View style={styles.buttonContainer} >
                        <Button title={"IMprimir"} onPress={print} />
                        <Button title={"Imprimir debug"} onPress={printDebug} />
                    </View>
                        : <Button title={"Validar con QR"} onPress={() => navigation.navigate("Scanner", {validate:false, type:"qr"})}/>
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
    text: {
        fontSize: 20,
    },
    field: {
        margin: "5%",
        backgroundColor: "#cedee0",
        height: 100,
        borderRadius: 20,
        fontFamily: "Helvetica, Arial, sans-serif;",
        paddingHorizontal: 25,
        marginBottom: 15,
        fontSize: 20,
        color: Colors.black,
    },
    buttonContainer: {
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
    buttonDebug: {
        borderColor: '#fafafa', 
        marginLeft: 20, 
        backgroundColor: 'white',
    },
    buttonPrint: {
        backgroundColor: '#2DCC70',
    },
    image: {
        width: 60,
        height: 60,
        margin: 10,
    },
})

export default Preview;