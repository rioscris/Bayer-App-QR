import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView, ScrollView,
    StatusBar, StyleSheet,
    Text, View
} from 'react-native';
import { Button, Card } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useDispatch } from 'react-redux';
import { UPDATE_STORAGE } from '../settings/action';
import useUpdateStorage from './hooks/useUpdateStorage';

const Presentation = () => (
    <View>
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Bienvenido a eLector</Text>
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
    const [debug, setDebug] = useState(false);

    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
              <TouchableOpacity style={{paddingRight:20}}>
                  <AntDesignIcon name='setting' size={30} color="white" onPress={() => navigation.navigate('Configuracion')} />
              </TouchableOpacity>
          ),
        });
      }, [navigation]);

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
                        <View style={{ padding: 10, backgroundColor: Colors.white }}>
                            <View >
                                <Button title="Generar codigo QR" onPress={() => navigation.navigate('Scanner', { validate: false, type: "barcode" })} disabled={device.macAddress === 0 && !debug} />
                            </View>
                            <View style={{paddingTop:10}}>
                                <Button title="Validar codigo QR" onPress={() => navigation.navigate('Scanner', { validate: true, type: "barcode" })} disabled={device.macAddress === 0 && !debug} />
                            </View>
                        <View>
                        <TouchableOpacity  onPress={() => setDebug(!debug)} style={{paddingLeft:"40%", paddingTop:10}}>
                           <MaterialCommunityIcons name={"duck"} size={50} color="pink"/>
                        </TouchableOpacity>
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
