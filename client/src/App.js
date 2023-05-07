/* Importing stuff */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/navbar';
import TodoLogic from './components/TodoLogic';
import Register from './components/Register';
import Login from './components/Login';
import Welcome from './components/Welcome';
import NotFound from './components/NotFound';

import { useAuthContext } from './hooks/useAuthContext';

function App() {
    const { user } = useAuthContext();
    return (
        <div className="App">
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route
                        path="/welcome"
                        element={!user ? <Welcome /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/"
                        element={user ? <TodoLogic /> : <Navigate to="/welcome" />}
                    />
                    <Route
                        path="Register"
                        element={!user ? <Register /> : <Navigate to="/" />}
                    />
                    <Route
                        path="Login"
                        element={!user ? <Login /> : <Navigate to="/" />}
                    />
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </BrowserRouter>

        </div>
    )
}

export default App;
