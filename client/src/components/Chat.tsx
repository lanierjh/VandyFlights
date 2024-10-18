import React, { useState } from 'react';
import Header from './Header';

export default function ChatPage() {
  const [selectedFriend, setSelectedFriend] = useState('James Huang');
  const [activeTab, setActiveTab] = useState('Friends');
  const [searchTerm, setSearchTerm] = useState(''); 
  const [filteredFriends, setFilteredFriends] = useState([]);

  const friendsList = [
    'Jane Sun',
    'James Huang',
    'Abdallah Safa',
    'Jackson Lanier',
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSearchTerm(''); 
    if (tab === 'Search Friends') {
      setFilteredFriends(friendsList);
    }
  };

  const handleFriendSelect = (friend) => {
    setSelectedFriend(friend);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = friendsList.filter((friend) =>
      friend.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredFriends(filtered);
  };

  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.mainContent}>
        <div style={styles.friendsList}>
          <div style={styles.tabContainer}>
            <button
              style={activeTab === 'Friends' ? styles.activeTab : styles.tab}
              onClick={() => handleTabClick('Friends')}
            >
              Friends
            </button>
            <button
              style={activeTab === 'Search Friends' ? styles.activeTab : styles.tab}
              onClick={() => handleTabClick('Search Friends')}
            >
              Search Friends
            </button>
          </div>
          
          {activeTab === 'Search Friends' && (
            <input
              type="text"
              placeholder="Search for a friend..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={styles.searchInput}
            />
          )}

          <ul style={styles.friendItems}>
            {(activeTab === 'Friends' ? friendsList : filteredFriends).map((friend, index) => (
              <li
                key={index}
                onClick={() => handleFriendSelect(friend)}
                style={styles.friendItem}
              >
                <span>{friend}</span>
                <span style={styles.messageTime}>13:24</span>
              </li>
            ))}
          </ul>
        </div>
        <div style={styles.chatWindow}>
          <h2 style={styles.chatHeader}>{selectedFriend}</h2>
          <div style={styles.messagesContainer}>
            <div style={styles.messageBubble}>VANDERBILT</div>
            <div style={styles.messageBubble}>I NEED TO CHANGE THIS.</div>
            <div style={styles.messageBubble}>HELP.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#F1D6D9',
    minHeight: '100vh',
  },
  mainContent: {
    display: 'flex',
    padding: '20px',
  },
  friendsList: {
    flex: '1',
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    marginRight: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  tabContainer: {
    display: 'flex',
    borderBottom: '1px solid #ccc',
    marginBottom: '10px',
  },
  activeTab: {
    flex: 1,
    padding: '10px',
    borderBottom: '2px solid black',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  tab: {
    flex: 1,
    padding: '10px',
    borderBottom: '2px solid transparent',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  searchInput: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '10px',
    border: '1px solid #ccc',
  },
  friendItems: {
    listStyle: 'none',
    padding: 0,
  },
  friendItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
    fontSize: '1.2rem',
  },
  messageTime: {
    color: '#999',
  },
  chatWindow: {
    flex: '2',
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  chatHeader: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  messagesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  messageBubble: {
    backgroundColor: '#f0f0f0',
    padding: '10px',
    borderRadius: '10px',
  },
};
