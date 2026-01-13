import ControlledRegistration from "./forms/ControlledRegistration";
import UncontrolledRegistration from "./forms/UncontrolledRegistration";

const App = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>controlled vs uncontrolled components</h2>

      <ControlledRegistration />
      <br />
      <UncontrolledRegistration />
    </div>
  );
};

export default App;
