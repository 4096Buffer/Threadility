import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./Routes/Login"
import Home from "./Routes/Home"
import ProtectedRoute from "./Helpers/ProtectedRoute";
import { UserProvider } from "./Helpers/ProtectedRoute";

const Panel = () => {
  return (
    <>
      <h1>Panel now</h1>
    </>
  )
}


function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/" element={<ProtectedRoute/>} >
            <Route path="/" element={<Home/>} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;