import React, { useRef, useState } from 'react';
import { FlatList, Dimensions } from 'react-native';
import VideoCard from '../components/video';
import { Videos } from '../components/videoList';

const { height } = Dimensions.get('window');

const HomeScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <FlatList
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      data={Videos}
      pagingEnabled
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item, index }) => (
        <VideoCard video={item} isVisible={index === currentIndex} />
      )}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{ viewAreaCoveragePercentThreshold: 80 }}
      getItemLayout={(_, index) => ({
        length: height,
        offset: height * index,
        index,
      })}
      snapToAlignment="start"
    />
  );
};

export default HomeScreen;
