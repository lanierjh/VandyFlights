import React, { useState } from 'react';
import Header from './Header'; // Assuming you have a Header component

export default function ChatPage() {
  const [selectedFriend, setSelectedFriend] = useState('James Huang');

  const friendsList = [
    'Jane Sun',
    'James Huang',
    'Abdallah Safa',
    'Jackson Lanier',
  ];

  const handleFriendSelect = (friend: string) => {
    setSelectedFriend(friend);
  };

  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.mainContent}>
        {/* Friends List Section */}
        <div style={styles.friendsList}>
          <div style={styles.tabContainer}>
            <button style={styles.activeTab}>Friends</button>
            <button style={styles.tab}>Search Friends</button>
          </div>
          <ul style={styles.friendItems}>
            {friendsList.map((friend, index) => (
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

        {/* Chat Section */}
        <div style={styles.chatWindow}>
          <h2 style={styles.chatHeader}>{selectedFriend}</h2>
          <div style={styles.messagesContainer}>
            {/* Chat messages will go here */}
            <div style={styles.messageBubble}>Lorem ipsum dolor sit amet.</div>
            <div style={styles.messageBubble}>Consectetur adipiscing elit.</div>
            <div style={styles.messageBubble}>Sed do eiusmod tempor.</div>
            {/* More messages */}
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#F1D6D9', // light pink background like in your image
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
