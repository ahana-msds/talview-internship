import React from "react";
import Header from "./basic-components/Header";
import Card from "./basic-components/Card";
import Footer from "./basic-components/Footer";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="app">
      <Header title="react basics with typescript" />

      <Card
        name="component architecture"
        description="breaking ui into small reusable parts"
      />

      <Card
        name="props and typing"
        description="passing typed data between components"
      />

      <Card
        name="functional components"
        description="modern way to write react components"
      />

      <Footer />
    </div>
  );
};

export default App;
