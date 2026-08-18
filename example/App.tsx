import React from 'react';
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    View,
    StatusBar,
} from 'react-native';
import { Carousel, CarouselHandle, RefreshDrag } from '../sdk/src';

import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@react-native-vector-icons/material-icons'

// Structure for a single image post taken from Unsplash API
interface imagePost {
    image: string | number;
    author: string;
}

export default function App() {
    const [allImages, setAllImages] = React.useState<{ [key: string]: imagePost[] }>({});

    React.useEffect(() => {
        fetchAllImages();
    }, []);

    const categories = [
        "wildlife",
        "mountains",
        "forest",
        "ocean",
        "birds",
        "flowers",
        "desert",
    ];

    // Fetch images from Unsplash API with specified category
    // Return list of imagePosts
    const fetchCategory = async (category: string): Promise<imagePost[]> => {
        try {
            const response = await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(category)}&per_page=10&order_by=relevant`,
                {
                    headers: {
                        Authorization: "Client-ID HrLjiB3cyMVxgDDo9bkr_otuzlOdBslX4alDN2AmV3E",
                    },
                }
            );

            console.log("Response status:", response.status);
            console.log("URL:", response.url);

            const json = await response.json();
            const images: imagePost[] = json.results.map(
                (post: any) => ({
                    image: post.urls.small,
                    author: post.user.name,
                })
            );
            return images;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    // Fetch image of all categories and store as dictionary of lists
    const fetchAllImages = async () => {
        let allImages: { [key: string]: imagePost[] } = {};
        for (const category of categories) {
            allImages[category] = await fetchCategory(category);
        }
        setAllImages(allImages);
    };

    const handleRefresh = () => {
        console.log("Refreshing images...");
        carouselRefs.current?.forEach(ref => ref?.scrollToIndex(0));
        return fetchAllImages();
    };

    const carouselRefs = React.useRef<Array<CarouselHandle | null>>([]);

    return (
        <>
            <StatusBar barStyle="dark-content" />

            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Photo showcase</Text>
                {/* Wraps vertically scrollable content with a refresh drag at the top */}
                <RefreshDrag
                    refreshHeight={50}
                    onRefresh={handleRefresh}
                    
                    renderRefresh={(pullProgress) => (
                        <View style={{
                            backgroundColor: '#fff',
                            width: '100%',
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',

                        }}
                        >
                            {/* Change color of refresh icon depending on pull progress */}
                             <MaterialIcons 
                                name="refresh" 
                                size={30} 
                                color={
                                    `rgb(
                                        ${255 - 255 * pullProgress * pullProgress}, 
                                        ${255 - 30 * pullProgress * pullProgress}, 
                                        ${255 - 1 * pullProgress * pullProgress}
                                    )`
                                }

                             />
                        </View>
                    )}
                >
                    <>
                    {/* Build a carousel list for each category */}
                    {categories.map((category, index) => {
                        return (
                            <View 
                                key={category}
                            >
                                <Text 
                                    key={`category-${index}`}
                                    style={{
                                        textAlign: 'center',
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                        backgroundColor: '#fff',
                                        paddingTop: 10,
                                    }}
                                >
                                    {category.toUpperCase()}
                                </Text>
                                <Carousel 
                                    key={`carousel-${index}`}
                                    ref={(ref) => {
                                        carouselRefs.current[index] = ref;
                                    }}
                                    itemWidth={250}
                                    itemSpacing={10}
                                    carouselStyle={styles.carousel}
                                    itemStyle={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingTop: 10,
                                    }}
                                    indicators={{
                                        containerStyle: {
                                            width: 300,
                                        },
                                        indicatorStyle: {
                                            marginTop: 20,
                                            width: 10,
                                        },
                                        activeStyle: {
                                            backgroundColor: 'red',
                                        }
                                    }}
                                    data={allImages[category] ?? []}
                                    renderItem={( item, index ) => (
                                        <View key={index} style={{
                                            width: '100%',
                                            height: '100%',
                                            borderWidth: 2,
                                            borderColor: '#000',
                                        }}>
                                            <Image 
                                                key={`image${index}`}
                                                source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                                                style={{ width: '100%', height: '90%', resizeMode: 'contain' }}
                                            />
                                            <Text style={{
                                                textAlign: 'center',
                                                fontSize: 14,
                                                color: '#000',
                                            }}>
                                                {item.author}
                                            </Text>
                                        </View>
                                    )}
                                />
                            </View>
                        );
                    })}
                    </>
                </RefreshDrag>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        width: '100%',
        height: 50,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#000',
    },
    refreshView: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    cardText: {
        fontSize: 18,
    },
    carousel: {
        width: '100%',
        backgroundColor: '#fff',
    },
    fetchErrorText: {
        backgroundColor: '#fff',
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    }
});
