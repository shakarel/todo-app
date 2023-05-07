import { Link } from "react-router-dom";
import { ReactComponent as NotFoundSVG } from "../svg/404.svg";

function NotFound() {
    return (
        <div>
            <h3 className="not-found-header">404</h3>
            <p className="not-found-p">Ooops! You weren't supposed to see this!</p>

            <Link to="/welcome" className="not-found-link">Take me home Contry Roads!</Link>
            <NotFoundSVG className="not-found-svg"/>  
        </div>
    )
}

export default NotFound;