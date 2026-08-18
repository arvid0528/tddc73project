import React from 'react';
import {
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
        pullProgress: number,
    ) => React.ReactNode;

    style?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
}

export default function RefreshDrag({
    children,
    onRefresh,
    refreshHeight = 80,
    renderRefresh,
    style,
    contentContainerStyle,
    ...scrollViewProps
}: RefreshDragProps) {

    const [isDragging, setIsDragging] = React.useState(false);
    const [pullProgress, setPullProgress] = React.useState(0);
    const [viewportHeight, setViewportHeight] = React.useState(0);

    const scrollViewRef = React.useRef<ScrollView>(null);
    const isRefreshingRef = React.useRef(false);
    const hasSetInitialOffset = React.useRef(false);
    const refreshTriggerOffset = 8;

    const getPullProgress = React.useCallback((y: number) => {
        const pullDistance = refreshHeight - y;
        const triggerDistance = Math.max(1, refreshHeight - refreshTriggerOffset);
        return Math.max(0, Math.min(1, pullDistance / triggerDistance));
    }, [refreshHeight]);

    const publishPullProgress = React.useCallback((progress: number) => {
        setPullProgress(previous =>
            previous === progress ? previous : progress,
        );
        // onPullProgress?.(progress);
    }, []);

    
    const resetScrollPosition = React.useCallback((animated: boolean) => {
        scrollViewRef.current?.scrollTo({ 
            x: 0, 
            y: refreshHeight, 
            animated,
        });
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
        if (isRefreshingRef.current) {
            return;
        }

        isRefreshingRef.current = true;

        try {
            await onRefresh();
        } finally {
            isRefreshingRef.current = false;
            publishPullProgress(0);
            resetScrollPosition(false);
        }
    };

    const handleScroll = (
        event: NativeSyntheticEvent<NativeScrollEvent>
    ) => {
        const y = event.nativeEvent.contentOffset.y;
        const progress = getPullProgress(y);

        publishPullProgress(progress);

        if (!isDragging) {
            if (!isRefreshingRef.current && y < refreshHeight) {
                resetScrollPosition(false);
            }
            return;
        }
    };

    const handleScrollEndDrag = (
        event: NativeSyntheticEvent<NativeScrollEvent>
    ) => {
        const y = event.nativeEvent.contentOffset.y;
        const progress = getPullProgress(y);
        setIsDragging(false);
        publishPullProgress(0);

        if (progress >= 1) {
            refresh().catch(console.error);
            return;
        }

        if (!isRefreshingRef.current && y < refreshHeight) {
            resetScrollPosition(false);
        }
    };

    const handleScrollBeginDrag = () => {
        setIsDragging(true);
    };

    const handleLayout = (event: LayoutChangeEvent) => {
        setViewportHeight(event.nativeEvent.layout.height);
    };


    // Content and styling for refresh view
    // Can be customized by implementing the renderRefresh prop with 
    // pullProgress is normalized from 0 to 1; ready state is derived from it.
    const isReadyToRefresh = isDragging && pullProgress >= 1;

    // Can be customized by implementing the renderRefresh prop with pullProgress.
    const refreshContent =
        renderRefresh
            ? renderRefresh(
                pullProgress,
            )
            :
            (
                <Text>
                    {
                        isReadyToRefresh
                            ? 'Release to refresh'
                            : 'Pull to refresh'
                    }
                </Text>
            );

    return (
        <View style={[styles.container, style]} onLayout={handleLayout}>

            <View
                pointerEvents="none"
                style={[
                    styles.refreshView,
                    {
                        height: refreshHeight
                    }
                ]}
            >
                {refreshContent}
            </View>


            <ScrollView
                {...scrollViewProps}
                ref={scrollViewRef}

                contentContainerStyle={[
                    styles.content,
                    { minHeight: viewportHeight + refreshHeight },
                    contentContainerStyle
                ]}

                bounces={false}
                alwaysBounceVertical={false}
                overScrollMode="never"

                onScroll={handleScroll}
                onScrollBeginDrag={handleScrollBeginDrag}
                onScrollEndDrag={handleScrollEndDrag}

                scrollEventThrottle={16}
            >
                <View style={{ height: refreshHeight }} />
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
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,

        alignItems: 'center',
        justifyContent: 'center',
    },

    scrollView: {
        flex: 1,
    },

    content: {
        flexGrow: 1,
    },

});