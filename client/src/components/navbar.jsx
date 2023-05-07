import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

function Navbar() {
    const { logout } = useLogout();
    const { user } = useAuthContext();

    // handling Logout
    function handleLogout() {
        logout();
    }

    return (
        <div className="container">

            <nav className="navbar">
                {user && (
                    <div className="nav-links logout">
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                )}

                {!user && (
                <div className="nav-links">
                    <Link to="/welcome">Home</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Sign Up</Link>
                </div>
                )}
            </nav>

        </div>
    )
}

export default Navbar;
