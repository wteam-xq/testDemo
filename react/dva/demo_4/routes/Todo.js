import React from 'react';
import { connect } from 'dva';
import App from '../components/App';

const TodoRoute = ({ dispatch, list, inputValue }) => {
  function handleDelete(id) {
    dispatch({
      type: 'todo/delete',
      payload: {id},
    });
  }
  function handleAdd() {
    dispatch({
      type: 'todo/add',
      payload: {},
    });
  }
  function handleChange(newVal) {
    dispatch({
      type: 'todo/change',
      payload: {newVal},
    });
  }

  return (
    <div>
      <h2>List of Todo</h2>
      <App onAddTodo={handleAdd} handleInputChange={handleChange} onTodoFinish={handleDelete} list={list} inputValue={inputValue} />
    </div>
  );
};

// export default TodoList;
export default connect(({ list, inputValue }) => ({
  list, inputValue
}))(TodoRoute);