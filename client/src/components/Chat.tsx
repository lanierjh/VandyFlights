import React, { useState,useEffect } from 'react';
import Header from './Header';
import {useRouter} from "next/navigation";

export default function ChatPage() {
    const router = useRouter();
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    useEffect(() => {
        // Check if accessToken is in localStorage
        const token = localStorage.getItem('accessToken');
        console.log("Retrieved token:", token);

        if (!token) {
            // Redirect to login if token is missing
            router.push('/');
        }
    }, [router]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friendsList, setFriendsList] = useState([
    {
      name: 'James Huang',
      lastMessageTime: '12:30',
      profile: {
        firstName: 'James',
        lastName: 'Huang',
        email: 'jameshuang@gmail.com',
        destination: 'LAX',
        graduatingClass: '2024',
      },
    },
  ]);
  const [currentTab, setCurrentTab] = useState('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const allUsers = [
    {
      name: 'Jane Sun',
      profile: {
        firstName: 'Jane',
        lastName: 'Sun',
        email: 'jane.sun@example.com',
        destination: 'JFK',
        graduatingClass: '2025',
      },
    },
    {
      name: 'Abdallah Safa',
      profile: {
        firstName: 'Abdallah',
        lastName: 'Safa',
        email: 'abdallah.safa@example.com',
        destination: 'MIA',
        graduatingClass: '2023',
      },
    },
    {
      name: 'Jackson Lanier',
      profile: {
        firstName: 'Jackson',
        lastName: 'Lanier',
        email: 'jackson.lanier@example.com',
        destination: 'ORD',
        graduatingClass: '2024',
      },
    },
  ];

  const handleFriendSelect = (friend) => {
    setSelectedFriend(friend);
  };

  const handleTabSwitch = (tab) => {
    setCurrentTab(tab);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 0) {
      const results = allUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) &&
          !friendsList.some((friend) => friend.name === user.name)
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleAddFriend = (user) => {
    setFriendsList([...friendsList, { ...user, lastMessageTime: 'New' }]);
    setSearchResults(searchResults.filter((u) => u.name !== user.name));
  };

  return (
    <div style={styles.pageContainer}>

      <Header />
      <section
        style={{
          ...styles.chatSection,
          flexDirection: isSmallScreen ? 'column' : 'row',
        }}
      >
        <div style={styles.friendsList}>
          <div style={styles.tabContainer}>
            <button
              style={currentTab === 'friends' ? styles.activeTab : styles.tab}
              onClick={() => handleTabSwitch('friends')}
            >
              Friends
            </button>
            <button
              style={currentTab === 'search' ? styles.activeTab : styles.tab}
              onClick={() => handleTabSwitch('search')}
            >
              Search Friends
            </button>
          </div>

          {currentTab === 'friends' && (
              <div style={styles.scrollableContainer}>
            <ul style={styles.friendItems}>
              {friendsList.map((friend, index) => (
                <li
                  key={index}
                  onClick={() => handleFriendSelect(friend)}
                  style={styles.friendItem}
                >
                  <div>
                    <span style={styles.friendName}>{friend.name}</span>
                    <div style={styles.friendProfile}>
                      <p>Email: {friend.profile.email}</p>
                      <p>Destination: {friend.profile.destination}</p>
                      <p>Graduating Class: {friend.profile.graduatingClass}</p>
                    </div>
                  </div>
                  <span style={styles.messageTime}>{friend.lastMessageTime}</span>
                </li>
              ))}
            </ul>
              </div>
          )}

          {currentTab === 'search' && (
            <div>
              <input
                type="text"
                placeholder="Search for friends"
                value={searchQuery}
                onChange={handleSearchChange}
                style={styles.searchInput}
              />
              <ul style={styles.friendItems}>
                {searchResults.map((user, index) => (
                  <li key={index} style={styles.friendItem}>
                    <div>
                      <span style={styles.friendName}>{user.name}</span>
                      <div style={styles.friendProfile}>
                        <p>Email: {user.profile.email}</p>
                        <p>Destination: {user.profile.destination}</p>
                        <p>Graduating Class: {user.profile.graduatingClass}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddFriend(user)}
                      style={styles.addButton}
                    >
                      Add
                    </button>
                  </li>
                ))}
                {searchQuery && searchResults.length === 0 && (
                  <p style={styles.noResults}>No users found.</p>
                )}
              </ul>
            </div>
          )}
        </div>

        <div style={styles.chatWindow}>
          {selectedFriend ? (
            <>
              <h2 style={styles.chatHeader}>{selectedFriend.name}</h2>
              <div style={styles.messagesContainer}>
                <div style={styles.messageBubble}>
                  Hi!
                </div>
                <div style={styles.messageBubble}>
                  Are you excited about the trip to{' '}
                  {selectedFriend.profile.destination}?
                </div>
              </div>
            </>
          ) : (
            <h2 style={styles.chatHeader}>Select a friend to chat with</h2>
          )}
        </div>
      </section>
    </div>
  );
}

const styles = {
  pageContainer: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4e8f0',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  chatSection: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: '1200px',
    padding: '30px',
    gap: '20px',
    flexDirection: 'row',
  },
  friendsList: {
    flex: '1',
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',

  },
  scrollableContainer: {
  overflowY: 'auto', // Enable vertical scrolling
  maxHeight: '250px', // Limit the height of the scrollable area
  paddingRight: '10px', // Add some padding for scrollbar spacing
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
  friendItems: {
    listStyle: 'none',
    padding: 0,
    marginTop: '10px',
  } as React.CSSProperties,
  friendItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '10px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
    fontSize: '1rem',
  },
  friendName: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  friendProfile: {
    marginTop: '5px',
    fontSize: '0.9rem',
    color: '#555',
  },
  messageTime: {
    color: '#999',
    fontSize: '0.9rem',
  },
  addButton: {
    padding: '5px 10px',
    backgroundColor: '#0b8457',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  noResults: {
    marginTop: '10px',
    color: '#999',
    fontStyle: 'italic',
  },
  chatWindow: {
    flex: '2',
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
},

  chatHeader: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  messagesContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    width: '100%',
  },
  messageBubble: {
    backgroundColor: '#f0f0f0',
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '70%',
  },
  searchInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
};
