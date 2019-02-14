import React, { Component } from "react";
import TodoList from "./TodoList";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      inputValue: ""
    };
  }

  onAddTodo() {
    this.setState({
      list: [...this.state.list, this.state.inputValue],
      inputValue: ""
    });
  }
  handleInputChange(e) {
    this.setState({ inputValue: e.target.value });
  }
  onTodoFinish(index) {
    console.log(index);
    const list = [...this.state.list];
    list.splice(index, 1);
    this.setState({
      list: list
    });
  }

  render() {
    let { list } = this.state;
    return (
      <div>
        <div>
          <input
            style={{
              height: "34px",
              lineHeight: "34px",
              width: "250px"
            }}
            value={this.state.inputValue}
            onChange={this.handleInputChange.bind(this)}
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
            onClick={this.onAddTodo.bind(this)}
          >
            add
          </button>
        </div>
        <TodoList list={list} onTodoFinish={this.onTodoFinish.bind(this)} />
      </div>
    );
  }
}

export default App;