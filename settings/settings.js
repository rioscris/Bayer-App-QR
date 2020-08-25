import React, { useState, useEffect } from 'react';
import { View, Text, Button, NativeModules, Alert } from 'react-native';
import {
    Colors,
} from 'react-native/Libraries/NewAppScreen';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch } from 'react-redux';
import { UPDATE_STORAGE } from './action';
const Settings = (props) => {

    const {navigation} = props;
    const [devices, setDeviceArray] = useState([]);
    const [loading, toggleLoading] = useState(false);
    const [deviceType, setDeviceType] = useState('');
    const dispatch = useDispatch();

    // useEffect(() => {
    //     try {
    //         const test = {name:"Luquiñasx3",macAdress:0}
    //         const jsonTest = JSON.stringify(test);
    //         AsyncStorage.setItem(
    //             '@storage_print',
    //             jsonTest
    //         );
    //         dispatch({type:UPDATE_STORAGE,payload:true})
    //     } catch (error) {
    //         alert(error)  
    //     }
    // }, [])

    return (
        <ScrollView>
            <View>
                <View style={{ padding: 10, backgroundColor: Colors.white }}>
                    <Button
                        title={"Listar dispositivos"}
                        onPress={() => {
                            toggleLoading(true);
                            NativeModules.RNZebraBluetoothPrinter.pairedDevices().then(res => {
                                console.log("ENTRE?")
                                setDeviceArray(res);
                                setDeviceType('paired');                      //filter array for printers [class:1664]
                                toggleLoading(false);
                            });
                        }}
                    ></Button>
                </View>
                {
                    devices.map((device) =>
                        <View style={{
                            backgroundColor: Colors.white,
                            flexDirection: 'column',
                            padding: 20,
                            justifyContent: 'center'
                        }}>
                            <View style={{
                                flex: 0.4
                            }}>
                                <Text>{device.name}</Text>
                            </View>
                            <View style={{
                                flex: 0.3
                            }}>
                                <Text>{device.address}</Text>
                            </View>
                                <View style={{ paddingTop: 10 }}>
                                    <Button
                                        title="Conectarme con el dispositivo"
                                        onClick={() => {
                                            NativeModules.RNZebraBluetoothPrinter.connectDevice(device.address).then(res => {
                                                const test = {name:device.name,macAdress:device.adress}
                                                const jsonTest = JSON.stringify(test);
                                                try {
                                                    AsyncStorage.setItem(
                                                        '@storage_print',
                                                        jsonTest
                                                        );
                                                        dispatch({type:UPDATE_STORAGE,payload:true})
                                                        alert("Se a conectado a la impresora con exito")
                                                        navigation.navigate("Home")
                                                } catch (error) {
                                                    alert("Se ha producido un error al querer conectarse con la impresora" + error)
                                                }
                                            });
                                        }}
                                    />
                                </View>
                        </View>
                    )}
            </View>

        </ScrollView>
    )
}

export default Settings;