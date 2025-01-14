import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { FaSearchengin } from "react-icons/fa";
import { CiSettings, CiLogout } from "react-icons/ci";
import i18n from "../../i18n";
import { AuthContext } from "../../UserContext/Context";
import styl from "./Sidebar.module.css";
import En from "../../../public/assets/icons/lang-icons/En-lang.png";
import Fr from "../../../public/assets/icons/lang-icons/Fr-lang.png";
import It from "../../../public/assets/icons/lang-icons/It-lang.png";
import SearchCard from "./components/searchCard/SearchCard.jsx";

const Sidebar = () => {
  const { t, user, Logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [displaySett, setDisplaySett] = useState('none')

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [currentLang, setCurrentLang] = useState(
    localStorage.getItem("lang") || "en"
  );
  const [isLangListOpen, setIsLangListOpen] = useState(false);

  const searchRef = useRef(null);
  const langListRef = useRef(null);
  const menuRef = useRef(null);

  const langIcons = { en: En, fr: Fr, it: It };

  const changeLanguage = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem("lang", lang);
    i18n.changeLanguage(lang);
    setIsLangListOpen(false);
  };

  const handleToggleLangList = () => {
    setIsLangListOpen((prev) => !prev);
  };

  const handleDisplaySettings = () => {
    setDisplaySett(displaySett === 'none' ? 'flex' : 'none');
  }

  const handleClickOutside = (event) => {
    if (langListRef.current && !langListRef.current.contains(event.target)) {
      setIsLangListOpen(false);
    }
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      menuRef.current.style.display = "none";
    }
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setSearchQuery("");
      setSearchResults([]);
      setHighlightedIndex(-1);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      fetch(`http://${import.meta.env.VITE_BACKEND_IP}/api/search/?q=${searchQuery}`)
        .then((response) => response.json())
        .then((data) => {
          const filteredResults = data.filter((item) => item.profile_name !== "ke3ki3a");
          setSearchResults(filteredResults);
        });
    } else {
      setSearchResults([]);
      setHighlightedIndex(-1);
    }
  }, [searchQuery]);

  const handleKeyDown = (event) => {
    if (searchResults.length > 0) {
      if (event.key === "ArrowDown") {
        setHighlightedIndex((prevIndex) =>
          prevIndex < searchResults.length - 1 ? prevIndex + 1 : 0
        );
      } else if (event.key === "ArrowUp") {
        setHighlightedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : searchResults.length - 1
        );
      } else if (event.key === "Enter" && highlightedIndex !== -1) {
        const selectedUser = searchResults[highlightedIndex];
        navigate(`/profile/${selectedUser.profile_name}`);
        setSearchQuery("");
        setSearchResults([]);
        setHighlightedIndex(-1);
      }
    }
  };

  const toggleMenu = () => {
    if (menuRef.current.style.display === "block") {
      menuRef.current.style.display = "none";
    } else {
      menuRef.current.style.display = "block";
    }
  };

  return (
    <div className={styl.navBar}>
      <div className={styl.langage}>
        <img src={langIcons[currentLang]} alt="Current Language" />
        <p onClick={handleToggleLangList}>
          {currentLang.toUpperCase()}
          <IoIosArrowDown />
        </p>
        {isLangListOpen && (
          <div
            className={styl.langageList}
            ref={langListRef}
            style={{ display: "flex" }}
          >
            {Object.entries(langIcons).map(([lang, icon]) => (
              <img
                key={lang}
                src={icon}
                alt={`${lang} icon`}
                onClick={() => changeLanguage(lang)}
              />
            ))}
          </div>
        )}
      </div>
      <div className={styl.searchComponents}>
        <div className={styl.search} ref={searchRef}>
          <div className={styl.iconSearch}>
            <FaSearchengin style={{ width: "50%", height: "50%" }} />
          </div>
          <div className={styl.inputSearch}>
            <input
              type="text"
              placeholder={t("Search...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {searchResults.length > 0 && (
              <div className={styl.searchResult}>
                {searchResults.slice(0, 5).map((user, index) => (
                  <SearchCard
                    key={user.id}
                    user={user}
                    isHighlighted={index === highlightedIndex}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styl.components}>
          <Link to={"/"}>
            <button
              style={{
                color: location.pathname === "/" ? "yellow" : "white",
              }}
            >
              {t("Home")}
            </button>
          </Link>
          <Link to={`/profile/${user?.user?.profile_name}`}>
            <button
              style={{
                color:
                  location.pathname === `/profile/${user?.user?.profile_name}`
                    ? "yellow"
                    : "white",
              }}
            >
              {t("Profile")}
            </button>
          </Link>
          <Link to={"/notification"}>
            <button
              style={{
                color:
                  location.pathname === "/notification" ? "yellow" : "white",
              }}
            >
              {t("Notification")}
            </button>
          </Link>
          <Link to={"/games"}>
            <button
              style={{
                color: location.pathname === "/games" ? "yellow" : "white",
              }}
            >
              {t("Games")}
            </button>
          </Link>
          <Link to={"/chat"}>
            <button
              style={{
                color: location.pathname === "/chat" ? "yellow" : "white",
              }}
            >
              {t("Chat")}
            </button>
          </Link>
          <div className={styl.sett}>
            <button onClick={toggleMenu} onClickCapture={handleDisplaySettings}>
              <div className={styl.extImg}>
                <div className={styl.intImg}>
                  <img src={user?.user?.avatar} />
                </div>
              </div>
            </button>
            <div id="menu" ref={menuRef} className={styl.settings} style={{display: displaySett}}>
              <div className={styl.links} onClick={() => navigate("/setting")}>
                <CiSettings /> {t("Setting")}
              </div>
              <div onClick={Logout} className={styl.links}>
                <CiLogout /> {t("Logout")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
