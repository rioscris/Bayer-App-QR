import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';
import {
    Button,
    Image, SafeAreaView, ScrollView,
    StatusBar, StyleSheet,
    Text, View, NativeModules
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useDispatch } from 'react-redux';
import { UPDATE_STORAGE } from '../settings/action';
import useUpdateStorage from './hooks/useUpdateStorage';
import Patodebug from '../../images/patodebug.png';


const Presentation = () => (
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
        <View style={[styles.sectionContainer, {marginBottom: 20}]}>
            <Text style={styles.sectionTitle}>Validación</Text>
            <Text style={styles.sectionDescription}>
                La aplicación permite leer el código QR generado, los códigos de barra de la etiqueta original y compararlos para verificar que se corresponden según la nomenclatura GS1.
        </Text>
        </View>
    </View>
)

const zpl = "^XA^FX^CF0,60^FO220,50^FDHello world^FS^XZ";
const Home = (props) => {
    const { navigation } = props;
    const [device, setDevice] = useState({ name: "", macAddress: 0 });
    const dispatch = useDispatch();
    const update = useUpdateStorage();
    const [debug, setDebug] = useState(false);
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

    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}>
                    <Presentation />
                    <View style={{margin: 20}}> 
                        <Text style={{fontSize: 20, width: "100%", padding: 10, color: Colors.white, borderRadius: 5, backgroundColor: device.macAddress !== 0 ? "#2DCC70" : "#d64040"}}>
                            {device.macAddress !== 0 ? `Se encuentra conectado al siguiente dispositivo: ${device.name} - ${device.macAddress}` :
                                `No se encuentra conectado a ningun dispositivo`}
                        </Text>
                    </View>
                    <View style={{ padding: 10, backgroundColor: Colors.white }}>
                        <Button title="Configuracion " onPress={() => navigation.navigate('Configuracion')} />
                        <View style={{paddingTop:10, paddingBottom: 10}}>
                            <Button title={"Print something"}
                            onPress={() => {
                                NativeModules.RNZebraBluetoothPrinter.print(device.macAddress,zpl).then((res) => {
                                console.log(res)
                                })
                            }}
                            disabled={device.macAddress === 0}
                            />
                        </View>
                        <Button title="Comenzar lectura" onPress={() => navigation.navigate('Scanner',{validate:false,type:"barcode"})} disabled={device.macAddress === 0 && !debug}/>
                        <Button title="Validar" onPress={() => navigation.navigate('Scanner',{validate:true,type:"barcode"})} disabled={device.macAddress === 0 && !debug}/>
                        <Button title="Verificar inputs" onPress={() => navigation.navigate('Verify')} disabled={device.macAddress === 0 && !debug}/>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => setDebug(!debug)}>
                            <Image style={styles.image} source={Patodebug}/>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.white,
        marginBottom: 30,
    },
    buttonContainer: {
        alignItems: "center", 
        justifyContent: "center", 
        // padding: 10,
        flexDirection: "row",
    },
    button: {
        // padding: 5, 
        backgroundColor: '#f2f2f2', 
        borderRadius: 50, 
        elevation: 10, 
        shadowColor: "#000", 
        shadowOpacity: 1, 
        shadowRadius: 5,
        borderColor: '#fafafa', 
        marginTop: 20, 
        marginBottom: 20,
        backgroundColor: 'white', 
    },
    image: {
        width: 60, 
        height: 60, 
        margin: 10,
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
