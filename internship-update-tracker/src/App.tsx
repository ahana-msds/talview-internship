import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AppRouter from "./routes/AppRouter";
import ErrorBoundary from "./components/error/ErrorBoundary";

const App = () => {
  return (
    <ErrorBoundary>
      <Navbar />
      <AppRouter />
      <Footer />
    </ErrorBoundary>
  );
};

export default App;
