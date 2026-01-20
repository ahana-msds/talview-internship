import {
    call,
    put,
    takeLatest,
    race,
    delay,
    cancelled,
} from "redux-saga/effects";
import {
    fetchUsersStart,
    fetchUsersSuccess,
    fetchUsersFailure,
} from "./userSlice";
import { fetchUsersApi } from "./userApi";

function* fetchUsersWorker(action) {
    try {
        // start loading
        yield put(fetchUsersStart());

        // race api call vs timeout
        const { data, timeout } = yield race({
            data: call(fetchUsersApi, action.payload),
            timeout: delay(3000),
        });

        if (timeout) {
            throw new Error("request timeout");
        }

        yield put(fetchUsersSuccess(data));
    } catch (error) {
        yield put(fetchUsersFailure(error.message));
    } finally {
        if (yield cancelled()) {
            console.log("previous request cancelled");
        }
    }
}

export function* userSaga() {
    // cancels previous search when a new one starts
    yield takeLatest("users/search", fetchUsersWorker);
}
