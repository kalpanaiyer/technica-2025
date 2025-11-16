import styles from "./Session.module.css";
// import { useNavigate } from 'react-router-dom'

import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth';
import Timer from "../../components/SessionComponents/Timer";
import SoundModal from "../../components/SessionComponents/SoundModal";
import Todo from "../../components/Todo/Todo";
import NotesButton from '../../components/NotesButton/NotesButton.tsx';
import { auth } from '../../../firebase.ts';
import { getUserNotes } from '../../services/NotesService.tsx';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase.ts';
import WaveTimer from "../../components/SessionComponents/WaveTimer";




const Session: React.FC = () => {
  // const navigate = useNavigate();
  const [notesCount, setNotesCount] = useState(0);

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          // Set up real-time listener on user's notes field
          const userDocRef = doc(db, 'users', user.uid);
          const unsubscribeListener = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
              setNotesCount(docSnap.data().notes || 0);
            } else {
              setNotesCount(0);
            }
          });
          return () => unsubscribeListener();
        } else {
          setNotesCount(0);
        }
      });
  
      return () => unsubscribe();
    }, []);

  // Function to refresh notes count
  const refreshNotes = async () => {
    const user = auth.currentUser;
    if (user) {
      const notes = await getUserNotes(user.uid);
      setNotesCount(notes);
    }
  };

  useEffect(() => {
      (window as unknown as Record<string, unknown>).refreshNavbarNotes = refreshNotes;
      return () => {
        delete (window as unknown as Record<string, unknown>).refreshNavbarNotes;
      };
    }, []);

  const [selectedIcon, setSelectedIcon] =  useState<"clock" | "wave">("clock");





  return (
    <>
      <div className={styles.sessionContainer}>

        <div className="flex justify-center pt-16">
            {selectedIcon === "clock" ? <Timer /> : <WaveTimer />}
            <SoundModal
                selectedIcon={selectedIcon}
                onSelectIcon={(icon) => setSelectedIcon(icon)}
            />
        </div>

        <div className="flex justify-start mt-4">
          <Todo />
        </div>
      </div>
    </>
  );
};

export default Session;
