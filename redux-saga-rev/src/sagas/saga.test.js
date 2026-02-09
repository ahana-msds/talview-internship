import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { watchUserFetch, userSaga } from './userSaga';
import { fetchUserRequest, fetchUserSuccess, fetchUserFailure } from '../features/userSlice';

/**
 * 6. Testing Sagas
 * Testing sagas can be done in two ways:
 * A) Step-by-step testing (Asserting each yield)
 * B) Integration testing (Asserting final effects/state using redux-saga-test-plan)
 *
 * This example uses redux-saga-test-plan which is the industrial standard.
 */

describe('User Saga Tests', () => {
    const mockUser = { id: 1, name: 'John Doe' };

    it('handles successful user fetch', () => {
        return expectSaga(watchUserFetch)
            // Provide a mock for the API call
            .provide([
                [matchers.call.fn(() => { }), mockUser], // match any call and return mockUser
            ])
            // Dispatch the triggering action
            .dispatch(fetchUserRequest(1))
            // Assert that fetchUserSuccess was dispatched with mockUser
            .put(fetchUserSuccess(mockUser))
            .run();
    });

    it('handles user fetch failure', () => {
        const error = new Error('Failed to fetch');

        return expectSaga(watchUserFetch)
            .provide([
                [matchers.call.fn(() => { }), throwError(error)], // simulate error
            ])
            .dispatch(fetchUserRequest('error'))
            .put(fetchUserFailure(error))
            .run();
    });
});
