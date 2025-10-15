import React from "react";
import Header from "./components/common/header/Header";
import Main from "./Paginas/main/Main";
import Footer from "./components/common/footer/Footer";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css"; 

function App() {
  return (
    <>
      <Header/>
      <Main/>
      <Footer/>
    </>
  );
}

export default App;
