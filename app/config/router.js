import React from 'react';
import {TabNavigator, StackNavigator} from 'react-navigation';
import {Icon} from 'react-native-elements';
import Feed from '../screens/feed';
import Comments from '../screens/comments';
import Login from '../screens/login';

export const FeedStack = StackNavigator({
	Login: {
		screen: Login,
		navigationOptions: {
			title: 'Login',
		},
	},
	Feed: {
		screen: Feed,
		navigationOptions: {
			title: 'Feed',
		},
	},
	Comments: {
		screen: Comments,
		navigationOptions: ({navigation}) => ({
			title: 'Comments',
		}),
	},
});

export const Root = StackNavigator({
	Tabs: {
		screen: FeedStack,
	},
}, {
	mode: 'modal',
	headerMode: 'none',
});
