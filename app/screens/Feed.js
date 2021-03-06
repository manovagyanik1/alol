import React, { Component } from 'react';
import {connect} from "react-redux";
import {fetchFeed, fetchFeedReaction} from '../thunks';
import FeedCard from "../components/feedCard";
import {
  Text,
  View,
  ScrollView,
    ImageEditor,
    Image,
    ImageStore,
  FlatList,
    StyleSheet,
} from 'react-native';
import Gen from "../utils/gen";
import Splash from './splash';
import FeedHeader from "../components/feedHeader";
import Analytics, {SCREEN} from "../utils/analytics";


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0)',
    },
    feedHeader: {
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
        backgroundColor: 'rgba(180,60,216,0.85)',
        height: 40,
    },
    feedHeaderPlaceholder: {
        width: '100%',
        backgroundColor: '#fff',
        height: 40,
    },
    feedContainer: {
        backgroundColor: "rgba(180,60,216, .3)",
    }
});


class FeedScreenElements extends Component {
  componentDidMount() {
      this.props.onMountDispatch();
      Analytics.trackScreenView(SCREEN.LOGIN);
      Analytics.setUser();
  }

  onCommentClick = ({index, postId}) => {
      Analytics.commentClick(postId);
    this.props.navigation.navigate('Comments', {index, postId});
  };

  onShareClick = ({feedIndex, feedId, url}) => {
      Analytics.shareClick(feedId);
      Gen.shareImage(url);
      // TODO: make api calls to backend to update share count
  };

  render() {
    const {feed: {posts}, onReactionClick, onMountDispatch, fetchNextPageFeed} = this.props;
    const {results} = posts;
    // implement isFetching. do in request posts.
    return (
            results.length > 0 ?
            <View style={styles.container}>
              <FlatList
                data={results}
                ListHeaderComponent={() => <View style={styles.feedHeaderPlaceholder}/>}
                style={styles.feedContainer}
                refreshing={posts.isFetching === true}
                onRefresh={() => onMountDispatch()}
                onEndReachedThreshold={5}
                onEndReached={() => fetchNextPageFeed({nextPageUrl: posts.pageInfo.nextPageUrl})}
                renderItem={({item, index}) => {
                  return <FeedCard
                    card={item}
                    onCommentClick={({postId}) => this.onCommentClick({index, postId})}
                    onReactionClick={({feedIndex, feedId, reactionType}) => onReactionClick({feedIndex, feedId, reactionType})}
                    feedIndex={index}
                    onShareClick={(data) => this.onShareClick(data)}
                  />
      }}
      keyExtractor={(card, index) => index}
    />
                <View style={styles.feedHeader}>
                    <FeedHeader />
                </View>
                </View>
            : <Splash/>
      );
  }
}

const mapStateToProps = (state, ownProps) => {
    return {
        feed: state.feed
    }
};

const mapDispatchToProps = (dispatch) => ({
    onMountDispatch: () => {
        dispatch(fetchFeed({}));
    },
    fetchNextPageFeed: ({nextPageUrl}) => {
        dispatch(fetchFeed({nextPageUrl}));
    },
    onReactionClick: ({feedIndex, feedId, reactionType}) => {
        Analytics.reactionClick({postId: feedId, reactionType});
        dispatch(fetchFeedReaction({feedIndex, feedId, reactionType}));
    },
}) ;


const Feed = connect(mapStateToProps, mapDispatchToProps)(FeedScreenElements);

export default Feed;
