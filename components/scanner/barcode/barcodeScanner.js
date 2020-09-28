import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions, Image, StyleSheet, Text,
    TouchableOpacity, View
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useDispatch } from 'react-redux';
import { Popup } from '../../../helper/components';
import { Manual, Settings, TorchOff, TorchOn } from '../../../images';
import useScannerStorage from '../../home/hooks/useScannerStorage';
import { MAX_CANT_COD_MAT, MAX_CANT_LOT, MAX_CANT_PALLET, MIN_CANT_QTY, MaskDefaults, defaultBarcodeTypes, defaultQrCodeTypes, MAX_SCANNER_MASK_SIZE } from '../../manual/constants';
import { SAVE_DATA_QR, SAVE_LOT_AUTO, SAVE_PALLET } from '../action';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { Button, Overlay, Slider, Icon } from 'react-native-elements';
import Animated from 'react-native-reanimated';
import AsyncStorage from '@react-native-community/async-storage';

const Mask = ({measures, type}) => {
    const {leftMargin, topMargin, frameWidth, frameHeight, isPortrait} = measures;
    return <>
        <View style={styles.maskOutter}>
            <View style={{height: isPortrait ? leftMargin : topMargin, width: '100%', backgroundColor: 'rgba(0,0,0,0.5)'}}/>
            <View style={{height: isPortrait ? frameWidth : frameHeight, flexDirection: "row"}}>
                <View style={{width: isPortrait ? topMargin : leftMargin, height: '100%', backgroundColor: 'rgba(0,0,0,0.5)'}}/>
                <View style={{width: isPortrait ? frameHeight : frameWidth, height: '100%'}}/>
                <View style={{width: isPortrait ? topMargin : leftMargin, height: '100%', backgroundColor: 'rgba(0,0,0,0.5)'}}/>
            </View>
            <View style={{height: isPortrait ? leftMargin : topMargin, width: '100%', backgroundColor: 'rgba(0,0,0,0.5)'}}/>
        </View>
        { type !== 'qr' && 
        <View style={{flex: 1, flexDirection: "column", justifyContent: 'center'}}>
            <View style={{borderBottomColor: '#b00000', borderBottomWidth: 6}}/>
        </View>
        }
    </>
}

const Torch = ({onPress, isOn}) => (
    <TouchableOpacity onPress={() => onPress()}>
        <Image style={styles.cameraIcon} source={isOn ? TorchOn : TorchOff} />
    </TouchableOpacity>
)

const Man = ({onPress}) => (
    <TouchableOpacity onPress={() => onPress()}>
        <Image style={styles.cameraIcon} source={Manual} />
    </TouchableOpacity>
)

const Adjust = ({onSave, onChange, value}) => {
    const [openPopup, setOpenPopup] = useState(false);
    return(
        <>
            <TouchableOpacity onPress={() => setOpenPopup(true)}>
                <Image style={styles.cameraIcon} source={Settings} />
            </TouchableOpacity>
            <Overlay isVisible={openPopup} animationType={"fade"}>
                <View style={{flexDirection: "column", justifyContent: "space-evenly", padding: 10}}>
                    <View style={{alignContent: 'center', flexDirection: "row", justifyContent: "center"}}>
                        <Text style={{fontSize: 21, fontWeight: 'bold', color: '#9C9C9C'}}>Ajuste el tamaño del lector</Text>
                    </View>
                    <Slider
                        value={value}
                        onValueChange={(value) => onChange(value)}
                        minimumValue={0}
                        maximumValue={MAX_SCANNER_MASK_SIZE}
                        step={0.01}
                        trackStyle={{ height: 10, backgroundColor: 'transparent' }}
                        thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
                        thumbProps={{
                            children: (
                              <Icon
                                name="check-circle"
                                type="feather"
                                size={10}
                                reverse
                                containerStyle={{ bottom: 10, right: 10 }}
                                color="#38A6E3"
                              />
                            ),
                          }}
                    />
                    <Text style={{fontSize: 18, color: '#757575', paddingBottom: 20}}>{Math.round(value * (100/MAX_SCANNER_MASK_SIZE))}%</Text>
                    <Button title={'Guardar'} onPress={() => {
                        setOpenPopup(false);
                        onSave(value);
                        ;}}/>
                </View>
            </Overlay>
        </>
    )
}

const BarcodeScanner = ({ navigation, route }) => {
    const [torch, setTorch] = useState(false);
    const { validate, type } = route.params;
    const dispatch = useDispatch();
    const scannerStorage = useScannerStorage();
    const [scanner, setScanner] = useState({ pallet: null, lot: null });
    const [Screen, setScreen] = useState({ w: Dimensions.get('screen').width, h: Dimensions.get('screen').height });
    const [mask, setMask] = useState({ leftMargin: 0, topMargin: 0, frameWidth: 0, frameHeight: 0, isPortrait: false, frameHeightRel: 0, frameWidthRel: 0, orientation: '' });
    const [popup, setPopup] = useState({visible: false, title: '', type: '', text: '', confirm: false});
    const [isBarcodeRead, setIsBarcodeRead] = useState(false);
    const isMounted = useRef(false);
    const [lostFocus, setLostFocus] = useState(false);
    const [frameRel, setFrameRel] = useState(MaskDefaults);
    const [adjustment, setAdjustment] = useState(0);

    useEffect(() => {
        if(frameRel){
            const isPortrait = Dimensions.get('window').height > Dimensions.get('window').width;
            const orientation = isPortrait ? 'portrait' : 'landscape';
    
            let frameWidthRel = frameRel[type][orientation].w;
            let frameHeightRel = frameRel[type][orientation].h;
    
            const totalFrameWidth = frameWidthRel * (isPortrait ? Screen.h : Screen.w);
            const totalFrameHeight = frameHeightRel * (isPortrait ? Screen.w : Screen.h);
            setMask({
                leftMargin: ((isPortrait ? Screen.h : Screen.w) - totalFrameWidth) / 2,
                topMargin: ((isPortrait ? Screen.w : Screen.h) - totalFrameHeight) / 2,
                frameWidth: totalFrameWidth,
                frameHeight: totalFrameHeight,
                isPortrait: isPortrait,
                orientation: orientation,
                frameHeightRel: frameHeightRel,
                frameWidthRel: frameWidthRel,
            });
            setAdjustment(isPortrait ? frameWidthRel : frameHeightRel);
        }
        return (() => {
            setMask({ leftMargin: 0, topMargin: 0, frameWidth: 0, frameHeight: 0, frameHeightRel: 0, frameWidthRel: 0, orientation: '' });
        });
    }, [Screen, validate, frameRel])

    const onBarCodeRead = (barcode) => {
        if (!lostFocus && !isBarcodeRead && barcode.data) {
            setIsBarcodeRead(true);
            if(scanner.pallet === null) { //Mensaje que diga, Pallet mal ingresado. o mal leido.
                if(barcode.data.length >= MAX_CANT_PALLET && /^\d+$/.test(barcode.data)){
                    dispatch({ type: SAVE_PALLET, payload: barcode.data });
                    setScanner({ ...scanner, pallet: barcode.data });
                    setPopup({visible: true, title: '¡Código leído!', type: 'approved', confirm: false});
                }
            }
            else if (scanner.lot === null) {
                if(barcode.data.length >= MAX_CANT_COD_MAT + MAX_CANT_LOT + MIN_CANT_QTY){
                    dispatch({ type: SAVE_LOT_AUTO, payload: barcode.data });
                    setScanner({ pallet: null, lot: null });
                    setLostFocus(true);
                    navigation.navigate('Visualización', { validate: validate });
                }
            }
        }
    }

    const onQrCodeRead = (barcode) => {
        if (!isBarcodeRead) {
            setIsBarcodeRead(true);
            dispatch({type: SAVE_DATA_QR, payload: barcode.data});
            navigation.navigate('Verificación');
        }
    }

    useEffect(() => {
        if (isBarcodeRead) setTimeout(() => {if(isMounted.current) setIsBarcodeRead(false)}, 2000)
    }, [isBarcodeRead])

    useFocusEffect(() => {
        if (lostFocus) { //Revisar esto.
            setLostFocus(false);
            if (scannerStorage.pallet && !scannerStorage.lot) // Pallet has been entered
                setScanner({ pallet: scannerStorage.pallet, lot: null });
            else if (!scannerStorage.pallet && !scannerStorage.lot) // Lot has been entered
                setScanner({ pallet: null, lot: null }); // Reset
        }
    }, [])

    useEffect(() => {
        isMounted.current = true;
        if (scannerStorage.pallet && !scannerStorage.lot) // Pallet has been entered
            setScanner({ pallet: scannerStorage.pallet, lot: null });
        else if (!scannerStorage.pallet && !scannerStorage.lot) // Lot has been entered
            setScanner({ pallet: null, lot: null }); // Reset
        
        AsyncStorage.getItem('@scanner').then((json) => {
            if(!json){ // Si la primera vez que leo el Async, esta vacio, seteo los defaults
                AsyncStorage.setItem('@scanner', JSON.stringify(MaskDefaults));
                setFrameRel(MaskDefaults); // This should happen anyways
            } 
            else {
                setFrameRel(JSON.parse(json));
            }
        });

        return(() => {
            isMounted.current = false;
        })
    }, [])

    useEffect(() => {
        if (popup.visible && !popup.confirm)
            setTimeout(() => { if(isMounted.current) setPopup({visible: false, title: '', type: '', text: '', confirm: false})}, 1000)
    }, [popup])

    return (
        <View style={styles.container}>
            <RNCamera
                style={styles.cameraView}
                rectOfInterest={{
                    x: mask.leftMargin / (mask.isPortrait ? Screen.h : Screen.w),
                    y: mask.topMargin / (mask.isPortrait ? Screen.w : Screen.h),
                    width: mask.frameWidth / (mask.isPortrait ? Screen.h : Screen.w),
                    height: mask.frameHeight / (mask.isPortrait ? Screen.w : Screen.h),
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
                cameraViewDimensions={{ width: (mask.isPortrait ? Screen.w : Screen.h), height: (mask.isPortrait ? Screen.h : Screen.w) }}
                onBarCodeRead={(barcode) => type === "barcode" ? onBarCodeRead(barcode) : onQrCodeRead(barcode)}
                barCodeTypes={type === "barcode" ? defaultBarcodeTypes : defaultQrCodeTypes}
            >
                <Mask measures={mask} type={type}/>
            </RNCamera>

            <View style={styles.bottomOverlay}>
                <Torch isOn={torch} onPress={() => setTorch(!torch)}/>
                <Adjust 
                    value={adjustment}
                    onChange={(value) => setAdjustment(value)}
                    onSave={(adjusted) => {
                        const newFrameRel = {...frameRel};
                        if(mask.isPortrait)
                            newFrameRel[type][mask.orientation].w = adjusted;
                        else
                            newFrameRel[type][mask.orientation].h = adjusted;
                        setFrameRel(newFrameRel);
                        AsyncStorage.setItem('@scanner', JSON.stringify(newFrameRel));
                    }}
                />
                {
                    type === "barcode" ?
                        <Man onPress={() => {
                            setLostFocus(true);
                            navigation.navigate('Manual', { validate: validate });
                        }}/>
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
                        <View style={[styles.instruction, {backgroundColor: '#38A6E3'}]}>
                            <Text style={styles.instructionText}>
                                {scanner.pallet === null ? "Pase el lector sobre el código de paleta" : "Pase el lector sobre el código de lote"}
                            </Text>
                        </View>
                    </View>
                    : <View style={{ bottom: 0, position: 'absolute', width: '100%' }}>
                    <View style={styles.instruction}>
                        <Text style={styles.instructionText}>
                            Escanee el código QR
                        </Text>
                    </View>
                </View>
            }
            <Popup visible={popup.visible} title={popup.title} text={popup.text} type={popup.type} width={'80%'} onPress={popup.confirm ? () => setPopup({visible: false, title: '', type: '', text: '', confirm: false}) : null}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexDirection: 'row',
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
        height: 50,
        justifyContent: "center",
        color: Colors.white,
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
    },
)

export default BarcodeScanner;