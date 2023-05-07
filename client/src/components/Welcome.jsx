import { ReactComponent as WelcomeSVG } from "../svg/welcome.svg";

function Welcome() {
    return (
        <div>
            <h4>Welcome to Shahar's Todo app</h4>
            <p className="welcome-text">This is my simple Todo app that allows you to keep track of your daily todos</p>
            <ul>
                <li>Add new todos</li>
                <li>Mark them as completed</li>
                <li>Delete them when your'e done</li>
            </ul>
            <WelcomeSVG className="welcome-svg"/>  
        </div>
    )
}

export default Welcome;