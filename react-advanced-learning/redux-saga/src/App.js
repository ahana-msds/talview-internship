import UserFetcher from "./components/UserFetcher";

function App() {
  return (
    <div>
      <h2>redux saga demo</h2>

      {/* component that dispatches saga action */}
      <UserFetcher />
    </div>
  );
}

export default App;
