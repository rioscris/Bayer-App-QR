import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions, Image, StyleSheet, Text,
    TouchableOpacity, View
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useDispatch } from 'react-redux';
import useScannerStorage from '../../home/hooks/useScannerStorage';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { SAVE_PALLET, SAVE_LOT_AUTO, SAVE_DATA_QR } from '../action'
import { Manual, TorchOff, TorchOn } from '../../../images';

const Mask = ({measures, type}) => {
    return <>
        <View style={styles.maskOutter}>
            <View style={{height: measures.leftMargin, width: '100%', backgroundColor: 'rgba(0,0,0,0.5)'}}/>
            <View style={{height: measures.frameWidth, flexDirection: "row"}}>
                <View style={{width: measures.topMargin, height: '100%', backgroundColor: 'rgba(0,0,0,0.5)'}}/>
                <View style={{width: measures.frameHeight, height: '100%'}}/>
                <View style={{width: measures.topMargin, height: '100%', backgroundColor: 'rgba(0,0,0,0.5)'}}/>
            </View>
            <View style={{height: measures.leftMargin, width: '100%', backgroundColor: 'rgba(0,0,0,0.5)'}}/>
        </View>
        { type !== 'qr' && 
        <View style={{flex: 1, flexDirection: "column", justifyContent: 'center'}}>
            <View style={{borderBottomColor: '#b00000', borderBottomWidth: 6}}/>
        </View>
        }
    </>
}

const Torch = ({onPress, isOn}) => {
    return (
    <TouchableOpacity onPress={() => onPress()}>
        <Image style={styles.cameraIcon} source={isOn ? TorchOn : TorchOff} />
    </TouchableOpacity>)
}

const BarcodeScanner = ({ navigation, route }) => {
    const [torch, setTorch] = useState(false);
    const { validate, type } = route.params;
    const dispatch = useDispatch();
    const scannerStorage = useScannerStorage();
    const [scanner, setScanner] = useState({ pallet: null, lot: null });

    const [Screen, setScreen] = useState({ w: Dimensions.get('screen').width, h: Dimensions.get('screen').height });
    const [mask, setMask] = useState({ leftMargin: 0, topMargin: 0, frameWidth: 0, frameHeight: 0 });

    const defaultBarcodeTypes = [RNCamera.Constants.BarCodeType.code128]
    const defaultQrCodeTypes = [RNCamera.Constants.BarCodeType.datamatrix]
    
    const [isBarcodeRead, setIsBarcodeRead] = useState(false);

    const [refresh, setRefresh] = useState(false);
    
    useEffect(() => {
        let frameWidthRel;
        let frameHeightRel;
        const isPortrait = Dimensions.get('window').height > Dimensions.get('window').width;
        if(type === 'qr'){
            frameWidthRel = isPortrait ? 0.5 : 0.8; //Aumenta el alto
            frameHeightRel = isPortrait ? 0.8 : 0.5; //Aumenta el ancho
        }
        else{
            frameWidthRel = isPortrait ? 0.25 : 0.3;
            frameHeightRel = isPortrait ? 1 : 1;
        }
        const totalFrameWidth = frameWidthRel * Screen.h;
        const totalFrameHeight = frameHeightRel * Screen.w;
        setMask({
            leftMargin: (Screen.h - totalFrameWidth) / 2,
            topMargin: (Screen.w - totalFrameHeight) / 2,
            frameWidth: totalFrameWidth,
            frameHeight: totalFrameHeight,
        })
    }, [Screen,validate])

    const onBarCodeRead = (barcode) => {
        if (!isBarcodeRead) {
            setIsBarcodeRead(true);
            if(barcode.data && scanner.pallet === null) { //Mensaje que diga, Pallet mal ingresado. o mal leido.
                dispatch({ type: SAVE_PALLET, payload: barcode.data });
                setScanner({ ...scanner, pallet: barcode.data });
            }
            else if (scanner.lot === null) {
                if(barcode.data && barcode.data.length === 22) {
                    dispatch({ type: SAVE_LOT_AUTO, payload: barcode.data });
                    setScanner({ pallet: null, lot: null });
                    navigation.navigate('Visualizacion', { validate: validate });
                }
                else {
                    Alert.alert('Error de lectura', 'El codigo de lote ingresado no cumple con el largo requerido (Material + Lote + Cantidad)');
                }
            }
        }
    }

    const onQrCodeRead = (barcode) => {
        if (!isBarcodeRead) {
            setIsBarcodeRead(true);
            dispatch({type: SAVE_DATA_QR, payload: barcode.data});
            navigation.navigate('Verificacion');
        }
    }

    useEffect(() => {
        if (isBarcodeRead) setTimeout(() => setIsBarcodeRead(false), 3000)
    }, [isBarcodeRead])

    useFocusEffect(() => {
        if (refresh) { //Revisar esto.
            setRefresh(false);
            if (scannerStorage.pallet && !scannerStorage.lot) // Pallet has been entered
                setScanner({ pallet: scannerStorage.pallet, lot: null });
            else if (!scannerStorage.pallet && !scannerStorage.lot) // Lot has been entered
                setScanner({ pallet: null, lot: null }); // Reset
        }
    }, [])

    return (
        <View style={styles.container}>
            <RNCamera
                style={styles.cameraView}
                rectOfInterest={{
                    x: mask.leftMargin / Screen.h,
                    y: mask.topMargin / Screen.w,
                    width: mask.frameWidth / Screen.h,
                    height: mask.frameHeight / Screen.w,
                }}
                captureAudio={false}
                onLayout={(event) => {
                    if (event.nativeEvent.layout.width && event.nativeEvent.layout.height)
                        setScreen({ w: event.nativeEvent.layout.width, h: event.nativeEvent.layout.height })
                }}
                flashMode={
                    torch ?
                        RNCamera.Constants.FlashMode.torch :
                        RNCamera.Constants.FlashMode.off}
                cameraViewDimensions={{ width: Screen.w, height: Screen.h }}
                onBarCodeRead={(barcode) => type === "barcode" ? onBarCodeRead(barcode) : onQrCodeRead(barcode)}
                barCodeTypes={type === "barcode" ? defaultBarcodeTypes : defaultQrCodeTypes}
            >
                <Mask measures={mask} type={type}/>
            </RNCamera>

            <View style={styles.bottomOverlay}>
                <Torch isOn={torch} onPress={() => setTorch(!torch)}/>
                {
                    type === "barcode" ?
                        <TouchableOpacity onPress={() => {
                            setRefresh(true);
                            navigation.navigate('Manual', { validate: validate });
                        }}>
                            <Image style={styles.cameraIcon} source={Manual} />
                        </TouchableOpacity>
                        : null
                }
            </View>
            {
                type === "barcode" ?
                    <View style={{ bottom: 0, position: 'absolute', width: '100%' }}>
                        <View style={styles.instruction}>
                            <Text style={styles.instructionText}>
                                {scanner.pallet === null ? '' : `Código Leido: ${scanner.pallet}`}
                            </Text>
                        </View>
                        <View style={styles.instruction}>
                            <Text style={styles.instructionText}>
                                {scanner.pallet === null ? "Pase el lector sobre el código de paleta" : "Pase el lector sobre el código de lote"}
                            </Text>
                        </View>
                    </View>
                    : <View style={{ bottom: 0, position: 'absolute', width: '100%' }}>
                    <View style={styles.instruction}>
                        <Text style={styles.instructionText}>
                            Escanee el codigo QR
                        </Text>
                    </View>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexDirection: 'row',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    mask: {
        position: 'absolute',
        borderWidth: 1.5,
        borderColor: '#62B1F6',
    },
    mask: {
        position: 'absolute',
        borderWidth: 1.5,
        borderColor: '#b00000',
        opacity: 0.5,
    },
    cameraIcon: {
        margin: 5,
        height: 50,
        width: 50,
    },
    bottomOverlay: {
        position: "absolute",
        marginTop: 5,
        width: "100%",
        flex: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    instruction: {
        height: 40,
        justifyContent: "center",
        color: Colors.white,
        borderRadius: 10,
        margin: 10,
    },
    instructionText: {
        textAlign: "center",
        fontFamily: "Helvetica, Arial, sans-serif;",
        color: Colors.white,
        fontSize: 20,
    },
    container: {
        flex: 1,
    },
      cameraView: {
        flex: 1,
        justifyContent: 'flex-start',
    },
      maskOutter: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      },
      maskInner: {
        width: 300,
        backgroundColor: 'transparent',
      },
      maskFrame: {
        backgroundColor: 'rgba(1,1,1,0.6)',
      },
      maskRow: {
        width: '100%',
      },
      maskCenter: { flexDirection: 'row' },
    },
)

export default BarcodeScanner;