import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Input, Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { Popup } from '../../helper/components';
import { TAGS, ZPL_DEFAULT } from '../preview/zpl';
import useZPLFile from './hooks/useZPLFile';

const Table = ({content}) => {
    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {content.map((row, ixRow) => 
            <View key={`${ixRow}`} style={{ flexDirection: 'row', width: '100%' }}>
                {row.map((cell, ixCell) => 
                    <View key={`${ixRow};${ixCell}`} style={{ 
                        width: `${Math.round(100 / row.length)}%`, 
                        borderWidth: 1, 
                        borderLeftWidth: ixCell > 0 ? 0 : 1, 
                        borderBottomWidth: content[ixRow + 1] ? 0 : 1,
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        flexDirection: 'row',
                        borderColor: "#C1C1C1", 
                        padding: 5}} ><Text style={styles.textView}>{cell ? cell : ''}</Text></View>
                )}
            </View>
        )}
    </View>
    )
}

const Editor = ({ navigation }) => {
    const [text, setText] = useState('');
    const [changes, setChanges] = useState(false);
    const fileMgr = useZPLFile();
    const [saved, setSaved] = useState(false);
    const [isValid, setValid] = useState(true);
    let initialText = '';

    useEffect(() => {
        fileMgr.getFileContent().then(content => {
            setText(content);
            initialText = content;
        })
    }, [])

    useEffect(() => {
        setChanges(text && text != initialText);
    }, [text])

    useEffect(() => {
        if(saved){
            setTimeout(() => {
                setSaved(false);
                fileMgr.saveFileContent(text).then(() => {
                    navigation.popToTop();
                })
            }, 1500)
        }
    }, [saved])

    const restoreZPL = () => {
        setText(ZPL_DEFAULT)
    }

    const checkValid = () => {
        if(text.includes(TAGS.PALLET) && text.includes(TAGS.MATCODE) && text.includes(TAGS.LOTNO) && text.includes(TAGS.QTY)){
            setSaved(true);
            setValid(true);
        }
        else{
            setValid(false);
        }
    }

    return (
        <ScrollView>
            <View styles={styles.container}>
                <Card>
                    <Input label={'Código de la etiqueta'} value={text} onChangeText={(e) => setText(e)} multiline={true} numberOfLines={4} inputContainerStyle={{borderBottomWidth:1}} errorMessage={isValid ? '' : 'El código debe contener todos los TAGS necesarios'} errorStyle={{fontSize: 15}}/>
                    <Card.Divider />
                    <View style={{ width: "100%", paddingBottom:10}}>
                        <Text style={{paddingBottom: 10, color: '#858d94', fontWeight: "bold", fontSize: 15 }}>Tags necesarios</Text>
                        <Table content={[
                            ['Código de paleta', '[PALLET]'], 
                            ['Código de Material', '[MATCODE]'],
                            ['Código de Lote', '[LOTNO]'],
                            ['Cantidad', '[QTY]']
                            ]}/>
                    </View>
                </Card>
            </View>
            <View style={styles.buttonContainer}>
                <View style={{ width: "30%", paddingTop: 10, paddingBottom:10 }}>
                    <Button title="Volver" onPress={() => navigation.popToTop()} />
                </View>
                <View style={{width:"30%"}} >
                    <Button  title="Restaurar" onPress={restoreZPL}/>
                </View>
                <View style={{ width: "30%", paddingTop: 10, paddingBottom:10}}>
                    <Button title="Guardar" onPress={() => checkValid()} disabled={!changes} buttonStyle={{backgroundColor:'#00C18A'}} />
                </View>
            </View>
            <Popup visible={saved} title={'¡Guardado!'} type={'approved'} text={'Ahora utilizaremos este código'}/>
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
    buttonContainer: {
        paddingTop: 10,
        alignItems: "center",
        justifyContent: "space-around",
        flexDirection: "row",
    },
    textView: {
        fontSize: 18,
    },
})

export default Editor;
