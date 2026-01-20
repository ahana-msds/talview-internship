import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store from "./redux/store";

// connects react app to browser dom
const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>
    {/* makes redux store available to entire app */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
