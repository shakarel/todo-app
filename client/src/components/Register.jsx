import { useRegister } from "../hooks/useRegister";
import { ReactComponent as RegisterSVG } from "../svg/register.svg";
const { useState } = require("react");

function Register() {
    const [_name, setName] = useState(''); // name is a saved word so I use _name instead
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signup, error, isLoading } = useRegister();


    const handleSubmit = async (e) => {
        e.preventDefault();

        await signup(_name, email, password);

        console.log(_name, email, password);
    };

    return (
        <form className="register" onSubmit={handleSubmit}>

            <label>Name</label>
            <input type="Name" onChange={(e) => setName(e.target.value)} value={_name} />

            <label>Email</label>
            <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} />

            <label>Password</label>
            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />

            <button disabled={isLoading}>Sign up</button>
            { error && <div className="error">{ error }</div> }

            <RegisterSVG className="register-svg"/>
        </form>
    );
}

export default Register;