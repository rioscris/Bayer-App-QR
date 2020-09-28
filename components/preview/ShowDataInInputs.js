import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Input, Text } from 'react-native-elements';

const ShowDataInInputs = ({pallet,matCode,lotNo,qty}) => {
    return (
        <Card >
            <Text style={styles.textView}>
                Número de paleta
                    </Text>
            <Card.Divider />
            <Input value={pallet} disabled={true} />
            <Text style={styles.textView}>
                Código de material
                    </Text>
            <Card.Divider />
            <Input value={matCode} disabled={true} />
            <Text style={styles.textView}>
                Número de lote
                    </Text>
            <Card.Divider />
            <Input value={lotNo} disabled={true} />
            <Text style={styles.textView}>
                Cantidad
                    </Text>
            <Card.Divider />
            <Input value={qty} disabled={true} />
        </Card>
    )
}

const styles = StyleSheet.create({
    textView: {
        paddingLeft: 10,
        fontSize: 20,
        paddingBottom: 10
    },
})

export default ShowDataInInputs