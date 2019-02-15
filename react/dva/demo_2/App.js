import React, { Component } from "react";
import TodoList from "./TodoList";
import PropTypes from 'prop-types'

class App extends Component {
  static propTypes = {
    inputValue: PropTypes.string, // 自定义todo值
    list: PropTypes.string.isRequired, // todo 列表
    onAddTodo: PropTypes.func, // 新增todo
    onTodoFinish: PropTypes.func, // todo 达成
    handleInputChange: PropTypes.func, // 自定义todo更新
  };
  static defaultProps = {
    inputValue: "",
    list: [],
  };
  constructor(props) {
    super(props);
  }

  render() {
    let { 
      list, inputValue, 
      handleInputChange,
      onAddTodo,
      onTodoFinish,
    } = this.props;
    return (
      <div>
        <div>
          <input
            style={{
              height: "34px",
              lineHeight: "34px",
              width: "250px"
            }}
            value={inputValue}
            onChange={handleInputChange}
          />
          <button
            style={{
              marginLeft: "10px",
              background: "orange",
              color: "#fff",
              border: "1px solid orange",
              height: "34px",
              width: "50px"
            }}
            onClick={onAddTodo}
          >
            add
          </button>
        </div>
        <TodoList list={list} onTodoFinish={onTodoFinish} />
      </div>
    );
  }
}

export default App;