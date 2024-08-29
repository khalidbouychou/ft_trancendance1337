import styles from "./Error.module.css";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className={styles.notFound}>
    <h1>404</h1>
    <p>Oops! Page Not Found</p>
    <Link to="/home" className={styles.homeLink}>Home</Link>
  </div>
  );
};

export default Error;
