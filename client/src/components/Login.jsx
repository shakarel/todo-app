import { useLogin } from "../hooks/useLogin";
import { ReactComponent as LoginSVG } from "../svg/login.svg";
const { useState } = require("react");

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useLogin();



    const handleSubmit = async (e) => {
        e.preventDefault();

        await login(email, password);

        console.log(email, password);
    };

    return (
        <div>

            <form className="login" onSubmit={handleSubmit}>
            
            <label>Email</label>
            <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} />

            <label>Password</label>
            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />

            <button disabled={isLoading}>Login</button>
            
            { error && <div className="error">{ error }</div> }

            <LoginSVG className="login-svg"/>


        </form>

        </div>

    );
}

export default Login;