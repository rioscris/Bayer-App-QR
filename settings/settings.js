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

    const { navigation } = props;
    const [devices, setDevices] = useState([]);
    const dispatch = useDispatch();

    const selectedDevices = (address,name) => {
        try {
        const test = { name: name, macAddress: address }
        const jsonTest = JSON.stringify(test);
            AsyncStorage.setItem(
                '@storage_print',
                jsonTest
            );
            dispatch({ type: UPDATE_STORAGE, payload: true })
            alert("Se a conectado a la impresora con exito")
            navigation.navigate("Home")
        } catch (error) {
            alert("Se ha producido un error al querer conectarse con la impresora, verifique que el dispositivo se encuentra emparejado o encendido" + error)
        }
    }

    return (
        <ScrollView>
            <View>
                <View style={{ padding: 10, backgroundColor: Colors.white }}>
                    <Button
                        title={"Listar dispositivos"}
                        onPress={() => {
                            NativeModules.RNZebraBluetoothPrinter.pairedDevices().then(res => {
                                setDevices(res);
                            });
                        }}
                    ></Button>
                </View>
                {devices.length > 0 && <View>
                    <Text>Seleccione la impresora que va a utilizar para imprimir</Text>
                </View>}
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
                                    onPress={() => selectedDevices(device.address,device.name)}
                                />
                            </View>
                        </View>
                    )}
            </View>

        </ScrollView>
    )
}

export default Settings;