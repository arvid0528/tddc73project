import React from 'react';
import {
    ActivityIndicator,
    LayoutChangeEvent,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    ScrollViewProps,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';

export interface RefreshDragProps
    extends Omit<
        ScrollViewProps,
        | 'children'
        | 'contentContainerStyle'
        | 'onScroll'
        | 'onScrollEndDrag'
        | 'style'
    > {
    children: React.ReactNode;
    onRefresh: () => Promise<void> | void;
    refreshHeight?: number;
    renderRefresh?: (
        isRefreshing: boolean,
        isReadyToRefresh: boolean,
    ) => React.ReactNode;
    style?: StyleProp<ViewStyle>;
    scrollViewStyle?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
}

/**
 * A dependency-free pull-to-reveal refresh container.
 *
 * Its children start above the refresh view. Pulling down exposes the view and
 * releasing at the top calls onRefresh before returning children to their place.
 */
export default function RefreshDrag({
    children,
    onRefresh,
    refreshHeight = 80,
    renderRefresh,
    style,
    scrollViewStyle,
    contentContainerStyle,
    ...scrollViewProps
}: RefreshDragProps) {
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [isReadyToRefresh, setIsReadyToRefresh] = React.useState(false);
    const [viewportHeight, setViewportHeight] = React.useState(0);
    const scrollViewRef = React.useRef<ScrollView>(null);
    const hasTriggeredRefresh = React.useRef(false);
    const hasSetInitialOffset = React.useRef(false);

    const resetScrollPosition = React.useCallback((animated: boolean) => {
        scrollViewRef.current?.scrollTo({ x: 0, y: refreshHeight, animated });
    }, [refreshHeight]);

    React.useEffect(() => {
        if (viewportHeight <= 0 || hasSetInitialOffset.current) {
            return;
        }

        const frame = requestAnimationFrame(() => {
            hasSetInitialOffset.current = true;
            resetScrollPosition(false);
        });

        return () => cancelAnimationFrame(frame);
    }, [resetScrollPosition, viewportHeight]);

    const refresh = async () => {
        if (isRefreshing) {
            return;
        }

        setIsRefreshing(true);
        try {
            await onRefresh();
        } finally {
            setIsRefreshing(false);
            setIsReadyToRefresh(false);
            resetScrollPosition(true);
        }
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const isReady = event.nativeEvent.contentOffset.y <= 0;
        setIsReadyToRefresh(previous =>
            previous === isReady ? previous : isReady,
        );

        if (!isReady) {
            hasTriggeredRefresh.current = false;
        }
    };

    const handleScrollEndDrag = (
        event: NativeSyntheticEvent<NativeScrollEvent>,
    ) => {
        if (
            event.nativeEvent.contentOffset.y <= 0 &&
            !hasTriggeredRefresh.current
        ) {
            hasTriggeredRefresh.current = true;
            refresh().catch(console.error);
        }
        else {
            resetScrollPosition(true);
        }
    };

    const handleLayout = (event: LayoutChangeEvent) => {
        setViewportHeight(event.nativeEvent.layout.height);
    };

    return (
        <View style={[styles.container, style]} onLayout={handleLayout}>
            <View 
                pointerEvents="none" 
                style={[styles.refreshView, { height: refreshHeight }]}>
                {
                    isRefreshing ? (
                        <ActivityIndicator />
                    ) : (
                        <Text>
                            {isReadyToRefresh ? 'Release to refresh' : 'Pull to refresh'}
                        </Text>
                    )
                }
            </View>
            <ScrollView
                {...scrollViewProps}
                ref={scrollViewRef}
                style={[styles.scrollView, scrollViewStyle]}
                contentContainerStyle={[
                    styles.content,
                    { minHeight: viewportHeight + refreshHeight },
                    contentContainerStyle,
                ]}
                bounces
                alwaysBounceVertical
                overScrollMode="always"
                onScroll={handleScroll}
                onScrollEndDrag={handleScrollEndDrag}
                scrollEventThrottle={16}
            >
                <View style={[styles.refreshSpacer, { height: refreshHeight }]} />
                {children}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
    },
    refreshView: {
        alignItems: 'center',
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    scrollView: {
        flex: 1,
        zIndex: 1,
    },
    content: {
        flexGrow: 1,
    },
    refreshSpacer: {
    },
});
