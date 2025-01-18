import React, { useState, useEffect } from "react";
import ContactItem from "./components/contactItem/ContactItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import styl from "./Sidebar.module.css";

function Sidebar({
  setupChatRoom,
  socket,
  data,
  allUsers,
  unreadMessages,
  t,
}) {
  const [search, setSearch] = useState("");
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [sortedRooms, setSortedRooms] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      try {
        
        if (socket && socket.readyState === WebSocket.OPEN) {
          console.log("searching for users");
          socket.send(JSON.stringify({
              type: "SEARCH_USERS",
              query: search,
            })
          );
        }
        else{
          console.log("socket not open");
        }
      } catch (error) {
        console.error("Error fetching matched users:", error);
      }
    };
    if (search.length == 2) {
      performSearch();
      setShowResults(true);
    }

    const filteredUsers = allUsers.filter((user) =>
      user.profile_name.toLowerCase().includes(search.toLowerCase())
    );
    setMatchedUsers(filteredUsers.slice(0, 5));
  }, [search]);

  useEffect(() => {
    setMatchedUsers(
      allUsers
        .filter((user) =>
          user.profile_name.toLowerCase().includes(search.toLowerCase())
        )
        .slice(0, 5)
    );
  }, [allUsers]);

  useEffect(() => {
    console.log("data:", data);
    console.log("data.chat_rooms:", data.chat_rooms);
    const filteredAndSortedRooms = data.chat_rooms
      .sort((a, b) => new Date(b.modified_at) - new Date(a.modified_at));
    setSortedRooms(filteredAndSortedRooms);
    console.log("sortedRooms:", filteredAndSortedRooms)
  }, [data.chat_rooms]);

  const sendSelectUserRequest = async (profile_name) => {
    try {
      socket.send(
        JSON.stringify({
          type: "SELECT_USER",
          profile_name: profile_name,
        })
      );
    } catch (error) {
      console.error("Error sending SELECT_USER request:", error);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setShowResults(e.target.value.length > 1);
  };

  const handleSubmitSearch = async (e) => {
    e.preventDefault();
    if (search.length >= 2) {
      await sendSelectUserRequest(search);
      setShowResults(false);
    }
  };

  const handleSelectUser = async (user) => {
    await sendSelectUserRequest(user.profile_name);
    setShowResults(false);
  };

  return (
    <div className={styl.sidebar}>
      <div className={styl.searchContainer} onSubmit={handleSubmitSearch}>
        <input
          type="text"
          className={styl.search}
          placeholder={t("Search contacts")}
          value={search}
          onChange={handleSearch}
          maxLength={50}
        />
        {showResults && (
          <div className={styl.searchResults}>
            {matchedUsers.map((user, index) => (
              <div
                key={index}
                className={styl.searchResultItem}
                onClick={() => handleSelectUser(user)}
              >
                <div className={styl.intImg}>
                    <div className={styl.intImg} style={{width: '42px', height: '47px'}}>
                      <img src={user.avatar} alt={user.profile_name} />
                    </div>
                  </div>         
                <p className={styl.searchResultUsername}>
                  {user.profile_name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={styl.contactList}>
        {sortedRooms.map((contact, index) => (
          <ContactItem
            key={index}
            contact={contact}
            currentUser={data.user}
            onClick={() => {
              setupChatRoom(contact);
            }}
            unreadMessages={unreadMessages}
          />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
