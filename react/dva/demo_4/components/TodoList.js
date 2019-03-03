import React, { Component } from "react";
import Todo from "./Todo";

class TodoList extends Component {
  constructor(props) {
    super(props);
  }

  getHtmlTodo() {
    return this.props.list.map((item, index) => {
      return (
        <Todo
          key={index}
          contents={item}
          index={index}
          onTodoFinish={this.props.onTodoFinish}
        />
      );
    });
  }

  render() {
    return (
      // <React.Fragement>替换<div>。可以在控制台看到外层div就没了
      <div>
        <ul>{this.getHtmlTodo()}</ul>
      </div>
    );
  }
}

export default TodoList;
