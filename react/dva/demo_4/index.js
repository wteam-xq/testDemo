import dva from "dva";

// 1. Initialize
const app = dva({
  initialState: {
    list: [],
    inputValue: ""
  }
});

// 2. Plugins
// app.use({});

// 3. Model
app.model(require("./models/todo").default);

// 4. Router
app.router(require("./router").default);

// 5. Start
app.start("#root");
