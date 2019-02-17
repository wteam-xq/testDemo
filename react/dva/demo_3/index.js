import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { Provider, connect } from 'react-redux'
// React component
import App from "./App";
import Server from "./Server";

// Action
const onAddTodoAction = { type: 'onAddTodo' }
const onTodoFinishAction = { type: 'onTodoFinish' }
const inputChangeAction = { type: 'inputChange' }

// Reducer
function app(state = { inputValue: "", list: [] }, action) {
  const { inputValue, list } = state
  switch (action.type) {
    case 'onAddTodo':
      console.log("msg:", action.msg)
      return { list: [...list, inputValue] }
    case 'onTodoFinish':
      let index = action.index;
      console.log("demo3 - finish:", index)
      list.splice(index, 1);
      return { list }
    case 'inputChange':
      let value = action.value;
      return { inputValue: value }
    default:
      return state
  }
}

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()
// Store
const store = createStore(app, applyMiddleware(sagaMiddleware))
// then run the saga
sagaMiddleware.run(Server)

// Map Redux state to component props
function mapStateToProps(state) {
  return {
    inputValue: state.inputValue,
    list: state.list,
  }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
  return {
    onAddTodo: () => dispatch(onAddTodoAction),
    onTodoFinish: (index) => {
      onTodoFinishAction.index = index;
      dispatch(onTodoFinishAction)
    },
    handleInputChange: (e) => {
      inputChangeAction.value = e.target.value;
      dispatch(inputChangeAction)
    },
  }
}

// Connected Component
const AppWrap = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

ReactDOM.render(
  <Provider store={store}>
    <AppWrap />
  </Provider>,
  document.getElementById('root')
)
