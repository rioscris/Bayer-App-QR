import AsyncStorage from '@react-native-community/async-storage';
import React, { useState } from 'react';
import { NativeModules, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-elements';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import {
    Colors
} from 'react-native/Libraries/NewAppScreen';
import { useDispatch } from 'react-redux';
import { Popup } from '../../helper/components';
import { UPDATE_STORAGE } from './action';
const Settings = (props) => {
    const { navigation } = props;
    const [devices, setDevices] = useState([]);
    const dispatch = useDispatch();
    const [popup, setPopup] = useState({visible: false, title: '', type: '', text: '', confirm: false});

    const selectedDevices = (address, name) => {
        try {
            const test = { name: name, macAddress: address }
            const jsonTest = JSON.stringify(test);
            AsyncStorage.setItem(
                '@storage_print',
                jsonTest
            );
            dispatch({ type: UPDATE_STORAGE, payload: true })
            setPopup({visible: true, title: 'Se a conectado a la impresora con exito', type: 'approved', confirm: false});
            navigation.goBack();
        } catch (error) {
            setPopup({visible: true, title: 'Error al conectarse con la impresora',text:"Por favor, verifique que el dispositivo se encuentra emparejado o encendido" + error,type: 'rejected', confirm: true});
        }
    }

    return (
        <View style={styles.body}>
            <FlatList
                ListHeaderComponent={
                    <>
                    <View style={{ padding: 10 }}>
                        <Button title="Editar ZPL" onPress={() => navigation.navigate('Editor')} />
                    </View>
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
                    </>
                }
                data={devices}
                keyExtractor={(item, index) => index.toString()}
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
            <Popup visible={popup.visible} title={popup.title} text={popup.text} type={popup.type} width={'80%'} onPress={popup.confirm ? () => setPopup({visible: false, title: '', type: '', text: '', confirm: false}) : null}/>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: Colors.white,
        height: "100%"
    },
});

export default Settings;