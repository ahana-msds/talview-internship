import { call, put, takeEvery } from "redux-saga/effects";
import { FETCH_USER, SET_USER } from "../redux/actions";

function fetchUserApi() {
    // mock api call
    return Promise.resolve({ name: "ahana" });
}

function* fetchUserWorker() {
    try {
        const user = yield call(fetchUserApi);
        yield put({ type: SET_USER, payload: user });
    } catch (error) {
        console.log("error occurred");
    }
}

export function* userSaga() {
    yield takeEvery(FETCH_USER, fetchUserWorker);
}
