import EventHandlers from "./event/EventHandlers";
import SyntheticEventDemo from "./event/SyntheticEventDemo";
import BubblingCapturing from "./event/BubblingCapturing";
import PreventDefaultDemo from "./event/PreventDefaultDemo";

const App = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>react event handling demos</h2>

      <EventHandlers />
      <SyntheticEventDemo />
      <BubblingCapturing />
      <PreventDefaultDemo />
    </div>
  );
};

export default App;
