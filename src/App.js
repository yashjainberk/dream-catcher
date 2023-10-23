// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from "firebase/firestore";
import SignIn from './SignIn';
import SignOut from './SignOut';
import { Container, TextArea, Button, Header, Text } from './StyledComponents';

function App() {
  const [user] = useAuthState(auth);
  const [dream, setDream] = useState('');

  const saveDream = async () => {
    if (user) {
      const userDocRef = doc(db, 'dreams', user.uid);
      await setDoc(userDocRef, { dream }, { merge: true });
      alert('Dream saved!');
    }
  };

  const makeCall = async () => {
    if (user) {
      try {
        const phoneNumber = 'user_phone_number'; // You need to get the user's phone number from somewhere
        const message = 'What did you dream about last night? Please log in to the Dream Catcher app to share your dream.';
        await axios.post('/call', { phoneNumber, message });
        alert('Call scheduled!');
      } catch (error) {
        console.error('Error scheduling call:', error);
        alert('Error scheduling call. Please try again later.');
      }
    }
  };

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, 'dreams', user.uid);
      getDoc(userDocRef).then(doc => {
        if (doc.exists()) {
          setDream(doc.data().dream);
        }
      });
    }
  }, [user]);

  return (
    <Container>
      <Header>Dream Catcher</Header>
      {user ? (
        <>
          <Text>What did you dream about last night?</Text>
          <TextArea 
            value={dream} 
            onChange={(e) => setDream(e.target.value)} 
          />
          <Button onClick={saveDream}>Save Dream</Button>
          <Button onClick={makeCall}>Schedule Call</Button>
          <SignOut />
        </>
      ) : (
        <>
          <Text>Sign in to share and log your dreams.</Text>
          <SignIn />
        </>
      )}
    </Container>
  );
}

export default App;
