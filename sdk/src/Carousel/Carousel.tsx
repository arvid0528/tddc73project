import React from 'react';
import {
    FlatList,
    Dimensions,
    View,
    Text,
    StyleSheet,
    StyleProp,
    ViewStyle,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Props for the Carousel component. 
// ItemWidth is required because it is used for item positioning and indexing.
// Optional props have default values that can be overridden. 
interface CarouselProps<T> {
    data: T[];
    itemWidth: number;
    itemHeight?: number;
    itemSpacing?: number;
    carouselStyle?: StyleProp<ViewStyle>;
    itemStyle?: StyleProp<ViewStyle>;
    indicators?: IndicatorProps;
    renderItem: (item: T, index: number) => React.ReactNode;
}

// Options and styling for the indicators
interface IndicatorProps {
    visible?: boolean;
    carouselStyle?: StyleProp<ViewStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    indicatorStyle?: StyleProp<ViewStyle>;
    activeStyle?: StyleProp<ViewStyle>;
}

export interface CarouselHandle {
    scrollToIndex: (index: number) => void;
}

const Carousel = React.forwardRef<CarouselHandle, CarouselProps<any>>(
    function Carousel(
        { 
            data, 
            renderItem, 
            itemWidth, 
            itemHeight=itemWidth, 
            itemSpacing=0,
            carouselStyle={},
            itemStyle={},
            indicators
        }: CarouselProps<any>,
        ref: React.ForwardedRef<CarouselHandle>
    ) {
            
        // Defaul indicator styling, can be overridden
        const indicatorConfig: IndicatorProps = {
            visible: true,
            containerStyle: [
                styles.indicatorContainer,
                indicators?.containerStyle,
            ],
            indicatorStyle: [
                styles.indicator,
                indicators?.indicatorStyle,
            ],
            activeStyle: [
                styles.selectedIndicator,
                indicators?.activeStyle,
            ],
        };

        const [selectedIndex, setSelectedIndex] = React.useState(0);

        // Calculates the index of the currently selected item based on scroll position
        const handleScrollEnd = (event: any) => {
            const offsetX = event.nativeEvent.contentOffset.x;
            
            // Index for the selected item in list
            const index = Math.round(
                offsetX / (itemWidth + itemSpacing)
            );
            
            setSelectedIndex(index);
        };

        const flatListRef = React.useRef<FlatList>(null);

        // Controls the exposed scrollTOIndex method
        React.useImperativeHandle(ref, () => ({
            scrollToIndex(index: number) {
                const offset = index * (itemWidth + itemSpacing);

                flatListRef.current?.scrollToOffset({
                    animated: true,
                    offset,
                    });

                setSelectedIndex(index);
            },
        }));
        
        return (
            <View style={[styles.carouselContainer, carouselStyle]}>
                <FlatList
                    ref={flatListRef}

                    data={data}

                    horizontal

                    showsHorizontalScrollIndicator={false}

                    snapToInterval={itemWidth + itemSpacing}

                    decelerationRate="fast"

                    disableIntervalMomentum

                    // Center items in the carousel
                    contentContainerStyle={{
                        paddingHorizontal:
                            (SCREEN_WIDTH - itemWidth) / 2,
                    }}
                    
                    onMomentumScrollEnd={handleScrollEnd}

                    renderItem={({ item, index }) => (
                        <View 
                            style={[{
                                width: itemWidth,
                                height: itemHeight,
                                marginRight: itemSpacing,
                                alignItems: 'center',
                                
                                },
                                itemStyle
                            ]}>
                            {renderItem(item, index)}
                        </View>
                    )}
                />
                {indicatorConfig.visible && (
                    <View 
                        style={[indicatorConfig.containerStyle]}>
                        {data.map((item, index) => (
                            <View 
                                key={index} 
                                style={
                                    index === selectedIndex ? 
                                        [
                                            indicatorConfig.indicatorStyle,
                                            indicatorConfig.activeStyle,
                                        ] 
                                        : indicatorConfig.indicatorStyle
                                }>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        );
    }
)

// Export with the props and the handler
export default Carousel as <T>(
    props: CarouselProps<T> & React.RefAttributes<CarouselHandle>
) => React.ReactElement;

// Defualt styling values
const styles = StyleSheet.create({
    carouselContainer: {
        alignItems: 'center',
        width: '100%',
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        maxWidth: SCREEN_WIDTH,
        flexWrap: 'wrap',
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