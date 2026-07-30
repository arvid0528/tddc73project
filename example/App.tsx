import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Carousel } from '../sdk/src';

export default function App() {
    
    const images = [
        "https://images.unsplash.com/photo-1772289238862-b99a59bfd6f5",
        "https://images.unsplash.com/photo-1772289495958-40e8d1058be6",
    
    ]

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Carousel Example
            </Text>

            <Carousel 
                itemWidth={300}
                itemSpacing={20}
                itemStyle={{
                    borderWidth: 1,
                    borderColor: 'black',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                indicators={{
                    indicatorStyle: {
                        
                    },
                    activeStyle: {
                        backgroundColor: 'red',
                    }
                }}
                data={images}
                renderItem={(item) => (
                    <Image 
                        source={{ uri: item }}
                        style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                    />
                )}
            />

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
    card: {
        width: 100,
        height: 100,
        backgroundColor: '#4dabf7',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    cardText: {
        fontSize: 18,
    },
});