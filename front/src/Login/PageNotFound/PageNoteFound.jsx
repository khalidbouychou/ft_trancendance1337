import React from "react";
import { Link } from "react-router-dom";
import "./style.css"
const PageNoteFound = () => {
  return (
    <div className="container">
      <h1>Page Not Found</h1>
      <Link className="backhome" to="/">Go back to home</Link>
    </div>
  );
};

export default PageNoteFound;
