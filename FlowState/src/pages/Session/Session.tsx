import styles from "./Session.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Timer from "../../components/SessionComponents/Timer";
import SoundModal from "../../components/SessionComponents/SoundModal";
import Todo from "../../components/Todo/Todo";
import { auth } from "../../../firebase.ts";
import { getUserNotes } from "../../services/NotesService.tsx";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase.ts";
import WaveTimer from "../../components/SessionComponents/WaveTimer";
import Decoration from "../../components/SessionComponents/Decoration.tsx";

const Session: React.FC = () => {
  const navigate = useNavigate();
  const [notesCount, setNotesCount] = useState(0);
  const [selectedIcon, setSelectedIcon] = useState<"clock" | "wave">("clock");

  // Confirmation popup state
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
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

  const handleCloseClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmLeave = () => {
    setShowConfirm(false);
    navigate("/dashboard");
  };

  const handleCancelLeave = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <div className={styles.sessionContainer}>
        {/* X Button */}
        <button
          onClick={handleCloseClick}
          className="absolute top-4 left-4 text-white font-bold text-xl p-2 bg-red-500 rounded-full hover:bg-red-600 transition"
          title="Exit Session"
        >
          ×
        </button>

        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs text-center">
              <p className="mb-4 font-semibold">Are you sure you want to leave?</p>
            <p className="mb-4 font color:gray">All notes will be lost - unless you come back within 5 minutes!</p>

              <div className="flex justify-around gap-4">
                <button
                  onClick={handleConfirmLeave}
                  className="px-4 py-2 bg-[#F4CAE0] text-black rounded hover:bg-[#ADA7C9]"
                >
                  I have to go!
                </button>
                <button
                  onClick={handleCancelLeave}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  I'll stay
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center pt-16">
          {selectedIcon === "clock" ? <Timer /> : <WaveTimer />}
          <SoundModal selectedIcon={selectedIcon} onSelectIcon={(icon) => setSelectedIcon(icon)} />
        </div>
        <div className="flex justify-start mt-4">
          <Todo />
        </div>
        <div className="absolute top-4 right-4">
          <Decoration />
        </div>
      </div>
    </>
  );
};

export default Session;
