import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, NativeModules, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { Popup } from '../../helper/components';
import useZPLFile from '../editor/hooks/useZPLFile';
import useScannerStorage from '../home/hooks/useScannerStorage';
import { SCAN_CLEAR } from '../scanner/action';
import ShowDataInInputs from './ShowDataInInputs';

const Preview = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const scanner = useScannerStorage();
    const { validate } = route.params;
    const [printing, setPrinting] = useState(false);
    const [device, setDevice] = useState({});
    const [popup, setPopup] = useState({visible: false, title: '', type: '', text: '', confirm: false});
    const zplMgr = useZPLFile();

    const print = () => {
        dispatch({ type: SCAN_CLEAR });
        setPrinting(true);
        setPopup({visible:true, title:"Imprimiendo...", text:"Enviando datos a la impresora", type:'', confirm:false})
        zplMgr.getZPL(scanner.pallet, scanner.matCode, scanner.lotNo, scanner.qty).then((zpl) => {
            NativeModules.RNZebraBluetoothPrinter.print(device.macAddress, zpl).then((res) => {
                setPopup({visible:false, title:'', text:'', confirm:false, type: ''})
                navigation.popToTop()
            }).catch(() => {
                setPopup({visible:true, title:"Error de conexión", type:"rejected", text:"Ha ocurrido un error al imprimir. Revise la conexión con la impresora.", confirm:true});
            })
        }).catch((error) => {
            setPopup({visible:true, title:"Error en ZPL", type:"rejected", text:"El código de la etiqueta no pudo ser procesado - asegúrese que todos los campos (tags) son válidos", confirm:true})
        })
        setPrinting(false);
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
            <Text h4 style={{ paddingLeft: 15, paddingTop: 10 }}>
                Datos leídos
            </Text>
            <View>
                <ShowDataInInputs pallet={scanner.pallet} matCode={scanner.matCode} lotNo={scanner.lotNo} qty={scanner.qty} />
            </View>
            <View style={styles.buttonContainer}>
                {
                    !validate ? <View style={styles.buttonContainer} >
                        <View style={{ width: "50%",paddingRight: 20  }}>
                            <Button
                                buttonStyle={{ backgroundColor: '#DB3834' }}
                                title={"Cancelar"} onPress={() => {
                                    dispatch({ type: SCAN_CLEAR })
                                    navigation.goBack();
                                }} />
                        </View>
                        <View style={{ width: "45%"}}>
                            <Button title={"Imprimir"}
                                buttonStyle={{ backgroundColor: '#00C18A' }}
                                onPress={print} />
                        </View>
                    </View>
                        : <View style={{ width: "80%" }}>
                            <Button title={"Validar con QR"}
                                buttonStyle={{ backgroundColor: '#00C18A' }}
                                onPress={() => navigation.navigate("Escanear", { validate: false, type: "qr" })} />
                        </View>
                }
            <Popup visible={popup.visible} title={popup.title} text={popup.text} type={popup.type} width={'80%'} onPress={popup.confirm ? () => {
                setPopup({visible:false,title:'',text:'',confirm:false,type: ''})
                navigation.popToTop()
                } : null}/>
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
        paddingTop: 5,
        paddingBottom: 10,
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