import JsxVsHtml from "./concepts/JsxVsHtml";
import VirtualDom from "./concepts/VirtualDom";
import PropsState from "./concepts/PropsState";
import LifecycleHooks from "./concepts/LifeCycleHooks";
import UseStateEffect from "./concepts/UseStateEffect";
import MemoCallback from "./concepts/MemoCallback";

function App() {
  return (
    <div style={{ padding: "20px" }}>

      <h2>College Course Registration Dashboard</h2>

      <JsxVsHtml />
      <VirtualDom />
      <PropsState />
      <LifecycleHooks />
      <UseStateEffect />
      <MemoCallback />

    </div>
  );
}

export default App;
