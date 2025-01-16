import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./style.css"
import { AuthContext } from '../../UserContext/Context';
const PageNoteFound = () => {
  const { t } = useContext(AuthContext);
  return (
    <div className="container">
      <h1> {t("Page Not Found")}</h1>
      <Link className="backhome" to="/">{t("Go back to home")}</Link>
    </div>
  );
};

export default PageNoteFound;
