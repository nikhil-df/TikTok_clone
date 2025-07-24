import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

type VideoProps = {
  uri: string;
  likes?: string[];
};

function VideoCard({ video, isVisible }: { video: VideoProps; isVisible: boolean }) {
  const videoRef = useRef<VideoRef>(null);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likes ? video.likes.length : 0);

  useEffect(() => {
    if (!isVisible) {
      videoRef.current?.seek?.(0);
    }
  }, [isVisible]);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => prev + (liked ? -1 : 1));
  };

  return (
      <View style={styles.container}>
        <Video
          source={{ uri: video.uri }}
          ref={videoRef}
          muted={muted}
          paused={!isVisible}
          repeat
          resizeMode="cover"
          style={StyleSheet.absoluteFill}
        />

        <TouchableOpacity style={styles.muteBtn} onPress={() => setMuted(!muted)}>
          <MaterialIcon name={muted ? 'volume-off' : 'volume-up'} size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.likeBtn} onPress={handleLike}>
          <MaterialIcon
            name={liked ? 'favorite' : 'favorite-border'}
            size={30}
            color={liked ? 'red' : 'white'}
          />
          <Text style={styles.likeCount}>{likeCount}</Text>
        </TouchableOpacity>
      </View>
  );
}

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    height : height - 60, 
    width,
  },
  muteBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  likeBtn: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    alignItems: 'center',
  },
  likeCount: {
    color: 'white',
    marginTop: 4,
    fontSize: 14,
  },
});

export default VideoCard;
