import React from 'react'
import { TextInput, StyleSheet, Button, Alert, View, ActivityIndicator, Image, NativeModules, Text, } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import useGetDataToValidate from './hooks/useGetDataToValidate';
import { ScrollView } from 'react-native-gesture-handler';

const Verify = (props) => {
    const scanner = useGetDataToValidate();
    console.log(scanner)

    if(scanner.qrPallet === scanner.pallet){
        Alert.alert("Tod ok")
    }

    return (
        <ScrollView>

            <View styles={styles.container}>
                <Text>
                    Datos extraidos del codigo de barra
            </Text>
                <TextInput
                    style={styles.field}
                    editable={false}
                    value={scanner.pallet}
                />
                <TextInput
                    style={styles.field}
                    editable={false}
                    value={scanner.lot}
                />
                <Text>
                    Datos extraidos del codigo QR
                </Text>
                <View style={styles.searchSection}>
                    {/* <Icon style={styles.searchIcon} name="ios-search" size={20} color="#000" /> */}
                    <TextInput
                        style={styles.field}
                        editable={false}
                        value={scanner.qrPallet}
                        // style={styles.input}
                        underlineColorAndroid="transparent"
                    />
                </View>
                <TextInput
                    style={styles.field}
                    editable={false}
                    value={scanner.qrCodMat}
                />
                <TextInput
                    style={styles.field}
                    editable={false}
                    value={scanner.qrLot}
                />
                <TextInput
                    style={styles.field}
                    editable={false}
                    value={scanner.qrCant}
                />
            </View>

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