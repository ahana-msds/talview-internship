import MouseTracker from "./render-props/MouseTracker";

function App() {
  return (
    <div>
      <h2>render props demo</h2>

      <MouseTracker
        render={(pos) => (
          <p>x: {pos.x}, y: {pos.y}</p>
        )}
      />
    </div>
  );
}

export default App;
