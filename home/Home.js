import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';
import {
    Button,
    SafeAreaView, ScrollView,
    StatusBar, StyleSheet,
    Text, View, NativeModules
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useDispatch } from 'react-redux';
import { UPDATE_STORAGE } from '../settings/action';
import useUpdateStorage from './hooks/useUpdateStorage';

const zpl = "^XA^FX^CF0,60^FO220,50^FDHello world^FS^XZ";
const Home = (props) => {
    const { navigation } = props;
    const [device, setDevice] = useState({ name: "", macAddress: 0 });
    const dispatch = useDispatch();
    const update = useUpdateStorage();

    useEffect(() => {
        try {
            const jsonValue = AsyncStorage.getItem('@storage_print');
            if (jsonValue !== null) {
                jsonValue.then((json) => {
                    const value = JSON.parse(json);
                    if (value != null) {
                        setDevice(value)
                    }
                })
                if(update === true){
                    dispatch({type:UPDATE_STORAGE,payload:false})
                }
            }
        } catch (error) {
            alert(error)
        }
        return (() => {
            setDevice({ name: "", macAddress: 0 })
        })
    }, [update])

    console.log(device)

    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}>
                    <View style={styles.body}>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Bienvenido a aplicación eLector</Text>
                            <Text style={styles.sectionDescription}>
                                Con esta aplicación podrá leer los códigos de barra de una etiqueta e imprimir los códigos QR correspondientes.
                            </Text>
                        </View>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Impresión</Text>
                            <Text style={styles.sectionDescription}>
                                Las etiquetas saldran por vía Bluetooth a una impresora portatil.
                            </Text>
                        </View>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Validación</Text>
                            <Text style={styles.sectionDescription}>
                                La aplicación permite leer el código QR generado, los códigos de barra de la etiqueta original y compararlos para verificar que se corresponden según la nomenclatura GS1.
                        </Text>
                        </View>
                    </View>
                    {/* esto hay que mejorarlo esticamente */}
                    <View style={{backgroundColor:Colors.white}}> 
                        {
                            device.macAddress !== 0 ? <Text style={styles.sectionDescription}>
                                Se encuentra conectado al siguiente dispositivo: {device.name} - {device.macAddress}
                            </Text> : <Text styles={styles.sectionDescription}>
                                    No se encuentra conectado a ningun dispositivo
                            </Text>
                        }
                    </View>
                    <View style={{ padding: 10, backgroundColor: Colors.white }}>
                        <Button title="Configuracion " onPress={() => navigation.navigate('Configuracion')} />
                    <View style={{paddingTop:10}}>
                    <Button title={"Print something"}
                      onPress={() => {
                          try{
                              NativeModules.RNZebraBluetoothPrinter.print(device.macAddress,zpl).then((res) => {
                                console.log(res)
                              })
                            }catch(error){
                                alert("Se ha producido un error al querer imprimir, verifique que su impresora este encendida" + error)
                            }
                      }}
                      disabled={device.macAddress === 0 ? true : false}
                    />
                    </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.lighter,
        marginBottom: 30,
    },
    engine: {
        position: 'absolute',
        right: 0,
    },
    body: {
        backgroundColor: Colors.white,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: Colors.dark,
    },
    highlight: {
        fontWeight: '700',
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
});

export default Home;
