import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView, ScrollView,
    StatusBar, StyleSheet,
    Text, View
} from 'react-native';
import { Card, Button,Icon } from 'react-native-elements'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useDispatch } from 'react-redux';
import { UPDATE_STORAGE } from '../settings/action';
import useUpdateStorage from './hooks/useUpdateStorage';
// import Icon from 'react-native-vector-icons/FontAwesome';



const Presentation = () => (
    <View>
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Bienvenido a aplicación eLector</Text>
            <Text style={styles.sectionDescription}>
                Con esta aplicación podrá leer los códigos de barra de una etiqueta e imprimir los códigos QR correspondientes.
            </Text>
        </View>
    </View>
)

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
                if (update === true) {
                    dispatch({ type: UPDATE_STORAGE, payload: false })
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
        <View style={styles.body}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}>
                    <Presentation />
                    <Card>
                        <View style={{ margin: 20 }}>
                            <Text style={{ fontSize: 20, width: "100%", padding: 10, color: Colors.white, borderRadius: 5, backgroundColor: device.macAddress !== 0 ? "#2DCC70" : "#d64040" }}>
                                {device.macAddress !== 0 ? `Se encuentra conectado al siguiente dispositivo: ${device.name} - ${device.macAddress}` :
                                    `No se encuentra conectado a ningun dispositivo`}
                            </Text>
                        </View>
                        <Card.Divider />
                        <View style={styles.buttons}>
                            <Button icon={<Icon name="home" />} onPress={() => navigation.navigate('Configuracion')} />
                            <View style={{paddingTop:10}} >
                                <Button title="Comenzar lectura" onPress={() => navigation.navigate('Scanner', { validate: false, type: "barcode" })} disabled={device.macAddress === 0} />
                            </View>
                            <View style={{paddingTop:10}}>
                                <Button title="Validar" onPress={() => navigation.navigate('Scanner', { validate: true, type: "barcode" })} disabled={device.macAddress === 0} />
                            </View>
                        </View>
                    </Card>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.white,
        marginBottom: 30,
    },
    buttons: {
        padding: 10,
        backgroundColor: Colors.white
    },
    body: {
        backgroundColor: Colors.white,
        height: "100%"
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
});

export default Home;
