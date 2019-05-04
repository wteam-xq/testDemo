import React from "react";
import ReactDOM from "react-dom";
import { message } from "antd";
// const { info } = Modal;

class Demo extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      demoTxt: "just a test demo",
    };
  }

  showInfo() {
    let detailNode = (
      <div style={{ lineHeight: "2em", color: "#595959" }}>
        <div>test info</div>
        <hr style={{ border: "1px dashed #ccc" }} />
        <div>
          <div>one</div>
          <div>two</div>
          <div>three</div>
        </div>
      </div>
    );
    info({
      title: "status detail",
      width: 800,
      content: detailNode,
      onOk() {}
    });
  }
  showMessage() {
    message.info("this is a info!", 5);
    // message.error("there are a error!");
    // message.warn("show warn!");
    // message.warning("show waring!");
    // message.success("show success!");
    // const hide = message.loading('Action in progress..', 0);
    // setTimeout(hide, 2500);
  }

  render() {
    const { demoTxt } = this.state;
    let demoPage = (<div className="demo-wrap">
      {demoTxt}
      {/* <div style={{fontSize: '18px'}} onClick={this.showInfo.bind(this)}>show info</div> */}
      <div style={{fontSize: '18px'}} onClick={this.showMessage.bind(this)}>show message</div>
    </div>);
    return demoPage;
  }
}
ReactDOM.render(<Demo />, document.getElementById("demo"));
