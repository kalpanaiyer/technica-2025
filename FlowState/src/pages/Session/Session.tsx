import styles from "./Session.module.css";
// import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Timer from "../../components/SessionComponents/Timer";
import SoundModal from "../../components/SessionComponents/SoundModal";
import Todo from "../../components/Todo/Todo";
import WaveTimer from "../../components/SessionComponents/WaveTimer";

const Session: React.FC = () => {
  // const navigate = useNavigate();

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
