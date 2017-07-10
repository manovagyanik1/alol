import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchFeed, fetchFeedReaction} from '../thunks';
import {Text, View, ScrollView, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import FBSDK, {LoginManager} from 'react-native-fbsdk';
import Gen from '../utils/gen';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginBottom: 15,
		elevation: 4,
	},
});
class LoginScreenElements extends Component {
	componentDidMount() {
		this.props.onMountDispatch();
	}

	fbAuth() {
		LoginManager.logInWithReadPermissions(['public_profile'])
            .then((result) => {
            if (result.isCancelled) {
            Gen.log('login was cancelled');
        } else {
            Gen.log(`login was success ${result.grantedPermissions.toString()}`);
        }
    }, (error) => {
        Gen.log(`An error occured ${error}`);
    });
	}

	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={this.fbAuth}>
					<Text>Login with facebook</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const mapStateToProps = (state, ownProps) => ({
	feed: state.user,
});

const mapDispatchToProps = (dispatch) => ({
	onMountDispatch: () => {
		dispatch(fetchFeed({}));
	},
});


const Login = connect(mapStateToProps, mapDispatchToProps)(LoginScreenElements);

export default Login;
