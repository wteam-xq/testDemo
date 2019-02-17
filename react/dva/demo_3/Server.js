import { call, put } from "redux-saga/effects";

// worker Saga: will be fired on onAddTodo actions
function* fetchUser(action) {
  try {
    const user = yield call("/api/get-user-info", "123");
    console.log("user:", user);
    yield put({ type: "onAddTodo", msg: "success" });
  } catch (e) {
    yield put({ type: "onAddTodo", msg: e.message });
  }
}

/*
  Starts fetchUser on each dispatched `onAddTodo` action.
  Allows concurrent fetches of user.
*/
function* Server() {
  yield takeEvery("onAddTodo", fetchUser);
}

export default Server;
