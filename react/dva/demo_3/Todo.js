import React from "react";

class TodoItem extends React.Component {
  constructor(props) {
    super(props);
  }

  onTodoFinish() {
    console.log(this.props.index); /*父组件传过来的值*/
    this.props.onTodoFinish(this.props.index); /*调用父组件方法*/
  }
  
  render() {
    return (
      <div style={{ width: "320px", height: "50px", lineHeight: "50px" }}>
        {/*父组件传过来的值*/}
        <span style={{ display: "inline-block", width: "162px" }}>
          {this.props.contents}
        </span>
        <button className="button-style" onClick={this.onTodoFinish.bind(this)}>
          finish
        </button>
      </div>
    );
  }
}
export default TodoItem;
