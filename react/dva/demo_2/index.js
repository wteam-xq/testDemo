import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
// React component
import App from "./App";

// Action
const onAddTodoAction = { type: 'onAddTodo' }
const onTodoFinishAction = { type: 'onTodoFinish' }
const inputChangeAction = { type: 'inputChange' }

// Reducer
function app(state = { inputValue: "", list: [] }, action) {
  let { inputValue, list } = state;
  if (!list) {
    list = [];
  }
  switch (action.type) {
    case 'onAddTodo':
      return { list: [...list, inputValue] }
    case 'onTodoFinish':
      let index = action.index;
      console.log("demo2 - finish:", index)
      list.splice(index, 1);
      return { list }
    case 'inputChange':
      let value = action.value;
      return { inputValue: value, list }
    default:
      return state
  }
}

// Store
const store = createStore(app)

// Map Redux state to component props
function mapStateToProps(state) {
  console.log("state:", state);
  return {
    inputValue: state.inputValue,
    list: state.list,
  }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
  return {
    onAddTodo: () => {
      dispatch(onAddTodoAction)
    },
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
