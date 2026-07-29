import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Carousel from './src/components/Carousel';

export default function App() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Carousel Example
            </Text>

            <Carousel />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 20,
    },
});