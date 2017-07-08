import {ActionTypes, Actions} from './actions';
import Gen from './utils/gen';
const errorFunc = (errorAction, dispatch) => (err) => {
	Gen.log(err);
	dispatch(Actions.decrementAPICount({}));
	dispatch(errorAction);
};

// TODO: implement afterTimeStamp
export const fetchFeed = ({beforeTimeStamp = null}) =>
    (dispatch) => {
        // TODO: add pagination logic
	dispatch(Actions.requestFeed({beforeTimeStamp}));
	dispatch(Actions.incrementAPICount({}));
	const url = `${Gen.getBaseUrl()}/v1/feed`;
	return fetch(url)
            .then(response => response.json())
            .then((paginatedPosts) => {
	Gen.log(paginatedPosts);
	dispatch(Actions.decrementAPICount({}));
	dispatch(Actions.receiveFeed({beforeTimeStamp, paginatedPosts}));
})
            .catch(errorFunc(Actions.errorFeed, dispatch));
};

export const fetchComments = ({feedIndex, beforeTimeStamp, postId}) => (dispatch) => {
    // TODO: add pagination logic
	dispatch(Actions.requestComment({}));
	dispatch(Actions.incrementAPICount({}));
	const url = `${Gen.getBaseUrl()}/v1/comments?postId=${postId}`;
	return fetch(url)
        .then(response => response.json())
        .then(paginatedComments => {
	Gen.log(paginatedComments);
	dispatch(Actions.decrementAPICount({}));
	dispatch(Actions.receiveComments({feedIndex, beforeTimeStamp, paginatedComments}));
})
    .catch(errorFunc(Actions.errorComments, dispatch));
};
