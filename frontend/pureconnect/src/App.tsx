import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminHome from "./pages/AdminHome";
import useLocalStorage from 'use-local-storage'
import Register from "./pages/Register";
import MyProfile from "./pages/MyProfile";
import PostPage from "./pages/PostPage";
import AdminPostReports from "./pages/AdminPostReports";
import ReportPage from "./pages/ReportPage";

function App() {

  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useLocalStorage('theme', defaultDark ? 'dark' : 'light');

  return (
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login theme={theme} setTheme={setTheme}/>}/>
            <Route path="/register" element={<Register theme={theme} setTheme={setTheme}/>}/>
            <Route path="/post/:postId" element={<PostPage theme={theme} setTheme={setTheme}/>}/>
            <Route path="/user/:userId" element={<div>User</div>}/>

            {/* User*/}
            <Route path="/home" element={<Home theme={theme} setTheme={setTheme}/>}/>
            <Route path="/my-profile" element={<MyProfile theme={theme} setTheme={setTheme}/>}/>



            <Route path="/settings" element={<div>Settings</div>}/>





            {/*Admin*/}
            <Route path="/admin-home" element={<AdminHome theme={theme} setTheme={setTheme}/>}/>
            <Route path="/admin-post-reports" element={<AdminPostReports theme={theme} setTheme={setTheme}/>}/>
            <Route path="/report/:reportId" element={<ReportPage theme={theme} setTheme={setTheme}/>}/>
            {/*<Route path="/post-report/:reportId" element={<PostReportPage theme={theme} setTheme={setTheme}/>}/>*/}

        </Routes>

      </BrowserRouter>
  );
}

export default App;
