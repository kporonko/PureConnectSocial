import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminHome from "./pages/AdminHome";

function App() {
  return (
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login/>}/>

            {/* User*/}
            <Route path="/home" element={<Home/>}/>







            {/*Admin*/}
            <Route path="/admin-home" element={<AdminHome/>}/>

        </Routes>

      </BrowserRouter>
  );
}

export default App;
