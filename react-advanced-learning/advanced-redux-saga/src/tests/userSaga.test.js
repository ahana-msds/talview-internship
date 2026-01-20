import { expectSaga } from "redux-saga-test-plan";
import { userSaga } from "../features/users/userSaga";
import * as api from "../features/users/userApi";
import { fetchUsersSuccess } from "../features/users/userSlice";

test("fetch users success flow", () => {
    jest
        .spyOn(api, "fetchUsersApi")
        .mockResolvedValue([
            { id: 1, name: "test user" },
        ]);

    return expectSaga(userSaga)
        .dispatch({
            type: "users/search",
            payload: "test",
        })
        .put.like({
            action: { type: fetchUsersSuccess.type },
        })
        .run();
});
