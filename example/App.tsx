import React from 'react';
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    View,
    StatusBar,
} from 'react-native';
import { Carousel, RefreshDrag } from '../sdk/src';

import { SafeAreaView } from 'react-native-safe-area-context';

interface post {
    id: string;
    title: string;
    image: string | number;
}

export default function App() {
    const [images, setImages] = React.useState<post[]>([]);
    const [fetchError, setFetchError] = React.useState('');

    React.useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const response = await fetch(
                "https://api.unsplash.com/photos/random?count=10",
                {
                    headers: {
                        Authorization: "Client-ID HrLjiB3cyMVxgDDo9bkr_otuzlOdBslX4alDN2AmV3E",
                    },
                }
            );

            console.log("Response status:", response.status);
            console.log("URL:", response.url);

            const json = await response.json();

            const images: post[] = json
                .slice(0, 10) // Limit to first 10 items
                .map((post: any) => ({
                    id: post.id,
                    title: post.description || "Untitled",
                    image: post.urls.small,
                }));
            
            console.log(`Fetched ${images.length} images:`, images);
            setFetchError('');

            setImages(images);
        } catch (error) {
            console.log(error);
            setImages([
                { id: '1', title: 'Image 1', image: require('./src/assets/img1.jpg') },
                { id: '2', title: 'Image 2', image: require('./src/assets/img2.jpg') },
                { id: '3', title: 'Image 3', image: require('./src/assets/img3.jpg') },
                { id: '4', title: 'Image 4', image: require('./src/assets/img4.jpg') },
                { id: '5', title: 'Image 5', image: require('./src/assets/img5.jpg') },
            ])
            setFetchError("Failed to fetch images: Using local backups");
        }
    };

    const handleRefresh = () => {
        console.log("Refreshing images...");
        return fetchImages();
    };

    return (
        <>
            <StatusBar barStyle="dark-content" />

            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Refreshing Carousel</Text>
                {fetchError ? <Text style={styles.fetchErrorText}>{fetchError}</Text> : null}
                <RefreshDrag
                    refreshHeight={50}
                    onRefresh={handleRefresh}
                    style={{
                        backgroundColor: '#888',
                    }}
                >
                    {
                        images.length > 0 ? (
                    <Carousel 
                            itemWidth={300}
                            itemSpacing={20}
                            carouselStyle={styles.carousel}
                            itemStyle={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 20,
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
                            data={images}
                            renderItem={( item ) => (
                                <Image 
                                    source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                                    style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                                />
                            )}
                    />
                    )
                    : (
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            width: '100%',
                            backgroundColor: '#fff',
                        }}>
                            <Text style={{
                                fontSize: 18,
                                color: '#000',
                            }}>No images to display
                            </Text>
                        </View>
                    )}
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
