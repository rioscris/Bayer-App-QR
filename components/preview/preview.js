import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { TextInput, StyleSheet, Button, Alert, View, ActivityIndicator, Image, NativeModules } from 'react-native';
import useScannerStorage from '../home/hooks/useScannerStorage';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import {SCAN_CLEAR} from '../scanner/action';
import { generateQR } from './zpl';
import AsyncStorage from '@react-native-community/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Print, Patodebug } from '../../images';

const Preview = (props) => {
    const dispatch = useDispatch();
    const scanner = useScannerStorage();
    const { navigation } = props;
    const [printing, setPrinting] = useState(false);
    const [device, setDevice] = useState({});
    const zpl = 
    `^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR6,6~SD15^JUS^LRN^CI0^XZ
    ^XA
    ^MMT
    ^PW799
    ^LL0519
    ^LS0
    
    ^BY198,198^FT435,385^BXN,9,200,0,0,1,~
    ^FH\\^FD\\7E19250000000001\\7E124080108274\\7E110ARACJ4\\7E1376720^FS
    ^PQ1,0,1,Y^XZ
    `;
    const print = () => {
        dispatch({type: SCAN_CLEAR});
        setPrinting(true);
        Alert.alert('Imprimiendo...', 
            'Enviando datos a la impresora', 
            [{text: 'Continuar', onPress: () => {
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
            }}]
        );
    }
    const printDebug = () => {
        setPrinting(true);
        dispatch({type: SCAN_CLEAR});
        Alert.alert('Imprimiendo...', 
            'Enviando datos a la impresora', 
            [{text: 'Continuar', onPress: () => {
                navigation.goBack();
                setPrinting(false);
            }}]
        );
    }
    useEffect(() => {
        AsyncStorage.getItem('@storage_print').then((json) => {
            const value = JSON.parse(json);
            setDevice(value);
        });
        if(scanner){
            if(scanner.lot && scanner.lot.length < 18){
                Alert.alert('Error de lectura',
                'El largo de la identificación de lote es menor a la necesaria (Material + Lote + Cantidad). Revise la lectura nuevamente.',
                [{text: 'Releer', onPress: () => {
                    dispatch({type: SCAN_CLEAR});
                    navigation.goBack()
                }}])
            }
            if(!scanner.pallet){
                Alert.alert('Error de lectura',
                'El codigo de palleta no fue leido correctamente.',
                [{text: 'Releer', onPress: () => {
                    dispatch({type: SCAN_CLEAR});
                    navigation.goBack()
                }}])
            }
        }
    }, []);
    
    return(
        <View styles={styles.container}>
            <TextInput 
                style={styles.field}
                editable={false}
                value={scanner.pallet}
            />
            <TextInput 
                style={styles.field}
                editable={false}
                value={scanner.lot}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, {backgroundColor: "#2DCC70"}]} onPress={() => print()} disabled={printing}>
                    <Image style={styles.image} source={Print}/>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, {borderColor: '#fafafa', marginLeft: 20, backgroundColor: 'white'}]} onPress={() => printDebug()}>
                    <Image style={styles.image} source={Patodebug}/>
                </TouchableOpacity>
            </View>
            {printing && <ActivityIndicator size='large' color='#00ff00'/>}
        </View>
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
    image: {
        width: 60, 
        height: 60, 
        margin: 10,
    },
})

export default Preview;