import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    Button,
    StatusBar,
    SafeAreaView,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import {
    Header,
    LearnMoreLinks,
    Colors,
    DebugInstructions,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';


const zpl = "^XA^FX^CF0,60^FO220,50^FDHello world^FS^XZ";
const Home = (props) => {
    const [device,setDevice] = useState({name:"",macAdress:0});
    const { navigation } = props;

    useEffect(() => {
        try {
            const jsonValue = AsyncStorage.getItem('@storage_print');
            if (jsonValue !== null) {
                jsonValue.then((json) => {
                    const value = JSON.parse(json);
                    if(value != null){
                        setDevice(value)
                    }
                })
            }
          } catch (error) {
              alert(error)
          }
    },[])

    console.log(device)

    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}>
                    <View>
                        {

                        }
                        <Text>
                            
                        </Text>
                    </View>
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
                    <View style={{ padding: 10, backgroundColor: Colors.white }}>
                        <Button title="Configuracion " onPress={() => navigation.navigate('Configuracion')} />
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
