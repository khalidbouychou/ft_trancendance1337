import React, { useEffect, useState, useRef } from 'react';
import styl from './Search.module.css';
import { FaSearchengin } from 'react-icons/fa6';
import SearchCard from '../Home/components/SearchCard/Searchcard';
import CardFriend from './components/CardFriend/CardUser';

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [allResResults, setAllResResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchResultRef = useRef(null);

  const fetchSearchResults = async (query) => {
    if (query.trim()) {
      const response = await fetch(
        `localhost:8000/api/search/?q=${query}`
      );
      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await fetchSearchResults(searchQuery);
      setAllResResults(searchResults);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchResultRef.current &&
        !searchResultRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchSearchResults(searchQuery);
  }, [searchQuery]);

  return (
    <div className={styl.Search}>
      <div className={styl.cont}>
        <div className={styl.head}>
          <h1>SEARCH</h1>
        </div>
        <div className={styl.search}>
          <div className={styl.extFrame}>
            <div className={styl.innerFrame}>
              <input
                type="text"
                placeholder="search..."
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <button className={styl.searchBut} onClick={handleSearch}>
              <FaSearchengin style={{ width: '70%', height: '70%' }} />
            </button>
          </div>

          {showResults && (
            <div className={styl.searchResult} ref={searchResultRef}>
              {searchResults.length > 0 ? (
                <div>
                  {searchResults.map((user) => (
                    <SearchCard key={user.id} user={user} />
                  ))}
                </div>
              ) : searchQuery.trim() !== '' ? (
                <div className={styl.noResult}>
                  <p>No results found</p>
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className={styl.allRes}>
          {allResResults.length > 0 ? (
            allResResults.map((user) => (
              <CardFriend key={user.id} user={user} />
            ))
          ) : searchQuery.trim() !== '' ? (
            <div className={styl.NoResult}>
              <h3>No results found "{searchQuery}"</h3>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Search;
