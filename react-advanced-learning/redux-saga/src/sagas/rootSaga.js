import { all } from "redux-saga/effects";
import { userSaga } from "./userSaga";

export default function* rootSaga() {
    // runs all sagas together
    yield all([userSaga()]);
}
