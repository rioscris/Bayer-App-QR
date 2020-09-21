import AsyncStorage from '@react-native-community/async-storage';
import React, { useState } from 'react';
import { NativeModules, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-elements';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import {
    Colors
} from 'react-native/Libraries/NewAppScreen';
import { useDispatch } from 'react-redux';
import { UPDATE_STORAGE } from './action';
const Settings = (props) => {
    const { navigation } = props;
    const [devices, setDevices] = useState([]);
    const dispatch = useDispatch();

    const selectedDevices = (address, name) => {
        try {
            const test = { name: name, macAddress: address }
            const jsonTest = JSON.stringify(test);
            AsyncStorage.setItem(
                '@storage_print',
                jsonTest
            );
            dispatch({ type: UPDATE_STORAGE, payload: true })
            alert("Se a conectado a la impresora con exito")
            navigation.goBack();
        } catch (error) {
            alert("Se ha producido un error al querer conectarse con la impresora, verifique que el dispositivo se encuentra emparejado o encendido" + error)
        }
    }

    return (
        <ScrollView>
            <View style={styles.body}>
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
                    <Text h4 style={{ paddingLeft: 15 }}>Seleccione la impresora</Text>
                </View>}
                <FlatList
                    data={devices}
                    renderItem={(item) =>
                        <Card key={item["index"]}>
                            <View style={{
                                backgroundColor: Colors.white,
                                flexDirection: 'column',
                                padding: 20,
                                justifyContent: 'center'
                            }}>
                                <View style={{
                                    flex: 0.4
                                }}>
                                    <Text>Nombre: {item["item"].name}</Text>
                                </View>
                                <View style={{
                                    flex: 0.3
                                }}>
                                    <Text>MAC: {item["item"].address}</Text>
                                </View>
                                <View style={{ paddingTop: 10 }}>
                                    <Button
                                        title="Conectarme con el dispositivo"
                                        onPress={() => selectedDevices(item["item"].address, item["item"].name)}
                                    />
                                </View>
                            </View>
                        </Card>
                    }
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: Colors.white,
        height: "100%"
    },
});

export default Settings;