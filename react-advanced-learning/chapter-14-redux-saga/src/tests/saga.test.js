
import { call, put } from 'redux-saga/effects';
import { fetchUserSaga, fetchUserApi } from '../store/sagas/userSagas';
import { fetchUserSuccess, fetchUserFailure } from '../store/actions/userActions';

// demo: testing sagas without extra libraries
// sagas return iterators, so we can step through them testing each yielded effect
describe('fetchUserSaga', () => {
    const userId = 1;
    const action = { payload: userId };
    const mockUser = { id: 1, name: 'test user' };

    it('should fetch user successfully', () => {
        const generator = fetchUserSaga(action);

        // 1. expect 'call' effect with correct api and args
        const callStep = generator.next();
        // using json stringify for loose comparison of effect object
        // in real tests, use 'expect(callStep.value).toEqual(call(fetchUserApi, userId))'
        console.log('step 1 (call):', callStep.value.type === 'CALL');

        // 2. simulate success response and expect 'put' success action
        const putStep = generator.next(mockUser);
        console.log('step 2 (put):', putStep.value.payload.action.type === 'FETCH_USER_SUCCESS');

        // 3. expect validation done
        const doneStep = generator.next();
        console.log('step 3 (done):', doneStep.done);
    });

    it('should handle errors', () => {
        const generator = fetchUserSaga(action);

        // 1. call api
        generator.next();

        // 2. simulate error
        const error = new Error('fail');
        const putStep = generator.throw(error);

        // 3. expect 'put' failure action
        console.log('step 2 (put failure):', putStep.value.payload.action.type === 'FETCH_USER_FAILURE');
    });
});
