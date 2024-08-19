import classes from "./Error.module.css";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className={classes.error}>
      <h1 className={classes.error_404}>404</h1>
      <div className={classes.error_line} />
      <div className={classes.text}>
        <h1 className={classes.error_title}>Page not found</h1>
        <p className={classes.error_description}>
          Oops! The page you are looking for does not exist. It might have been
          moved or deleted.
        </p>
        <Link to="/">
          <button className={classes.error_btn}>Go back to the homepage</button>
        </Link>
      </div>
    </div>
  );
};

export default Error;
