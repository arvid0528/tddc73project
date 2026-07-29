import React from 'react';
import {
    FlatList,
    Dimensions,
    View,
    Text,
    StyleSheet,
    ViewToken
} from 'react-native';

import { carouselData } from '../data/carouselData';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CARD_WIDTH = 200;
const CARD_SPACING = 20;



export default function Carousel() {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const handleScrollEnd = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;

        const index = Math.round(
            offsetX / (CARD_WIDTH + CARD_SPACING)
        );

        setSelectedIndex(index);
    };

    return (
        <View >
            <FlatList
                data={carouselData}

                horizontal

                showsHorizontalScrollIndicator={false}

                snapToInterval={CARD_WIDTH + CARD_SPACING}

                decelerationRate="fast"

                disableIntervalMomentum

                contentContainerStyle={{
                    paddingHorizontal:
                        (SCREEN_WIDTH - CARD_WIDTH) / 2,
                }}
                
                onMomentumScrollEnd={handleScrollEnd}

                renderItem={({item}) => (
                    <View style={styles.card}>
                        <Text>
                            {item.title}
                        </Text>
                    </View>
                )}
            />
            <View style={styles.indicatorContainer}>
                {carouselData.map((item, index) => (
                    <View 
                        key={item.id} 
                        style={index == selectedIndex ? [styles.indicator, styles.selectedIndicator] : styles.indicator}>

                    </View>
                ))}
            </View>
            <Text>{selectedIndex}</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        height: 200,
        marginRight: CARD_SPACING,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightblue',
        marginBottom: 20,
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    indicator: {
        borderWidth: 1,
        borderColor: '#000',
        width: 10, 
        height: 10,
        borderRadius: 5,
        margin: 5,
    },
    selectedIndicator: {
        backgroundColor: '#000',
    }

});