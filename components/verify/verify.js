import React from 'react'
import { TextInput, StyleSheet, Alert, View, ActivityIndicator, Image, NativeModules} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import useGetDataToValidate from './hooks/useGetDataToValidate';
import { ScrollView } from 'react-native-gesture-handler';
import {Text,Input,Button} from 'react-native-elements'
import ShowDataInInputs from '../preview/ShowDataInInputs';

const Verify = ({navigation}) => {
    const scanner = useGetDataToValidate();

    if(scanner.qrPallet !== scanner.pallet)
        Alert.alert("Error en codigo de paleta")

    if(scanner.qrCodMat !== scanner.matCode)
        Alert.alert("Error en codigo de material")

    if(scanner.qrLot !== scanner.lotNo)
        Alert.alert("Error en codigo de lote")

    if(scanner.qrCant !== scanner.qty)
        Alert.alert("Error en cantidad")

    const verification = 
        scanner.qrPallet === scanner.pallet && 
        scanner.qrCodMat === scanner.matCode &&
        scanner.qrLot === scanner.lotNo &&
        scanner.qrCant === scanner.qty;

    return (
        <ScrollView>
            <View styles={styles.container}>
                <Text style={styles.text}>
                    Datos extraidos del codigo de barra
                </Text>
                <ShowDataInInputs scanner={scanner}/>
                <Text style={styles.text}>
                    Datos extraidos del codigo QR
                </Text>
                <Text style={styles.text}>
                    Numero de paleta
                </Text>
                <TextInput
                    style={styles.field}
                    editable={false}
                    value={scanner.qrPallet}
                />
                <Text style={styles.text}>
                    Código de material
                </Text>
                <TextInput
                    style={styles.field}
                    editable={false}
                    value={scanner.qrCodMat}
                />
                <Text style={styles.text}>
                    Código de lote
                </Text>
                <TextInput
                    style={styles.field}
                    editable={false}
                    value={scanner.qrLot}
                />
                <Text style={styles.text}>
                    Cantidad
                </Text>
                <TextInput
                    style={styles.field}
                    editable={false}
                    value={scanner.qrCant}
                />
            </View>
            <View style={{margin: 20}}>
                <Text style={{fontSize: 20, width: "100%", padding: 10, color: Colors.white, borderRadius: 5, backgroundColor: verification ? "#2DCC70" : "#d64040"}}>
                    {verification ? 'Los datos en los dos grupos son correctos' : 'Los datos en los dos grupos difieren'}
                </Text>
            </View>
            <Button title="Volver" onPress={() => navigation.popToTop()} />
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
    text: {
        fontSize: 20,
    },
    field: {
        margin: "5%",
        backgroundColor: "#cedee0",
        height: 100,
        borderRadius: 20,
        fontFamily: "Helvetica, Arial, sans-serif;",
        paddingHorizontal: 25,
        marginBottom: 15,
        fontSize: 20,
        color: Colors.black,
    },
    buttonContainer: {
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
    image: {
        width: 60,
        height: 60,
        margin: 10,
    },
})

export default Verify;