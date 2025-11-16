import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './WaveTimer.module.css';
const WaveTimer: React.FC = () => {
const location = useLocation();
const initialMinutes = location.state?.duration || 25;
const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
const [isRunning, setIsRunning] = useState(false);
const intervalRef = useRef<number | null>(null);
const totalSeconds = initialMinutes * 60;
// Progress: 0% at start, 100% when complete
const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
useEffect(() => {
    if (isRunning && timeLeft > 0) {
        intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
            if (prev <= 1) {
            setIsRunning(false);
            return 0;
            }
            return prev - 1;
        });
        }, 1000);
    } else {
        if (intervalRef.current) {
        clearInterval(intervalRef.current);
        }
    }
    return () => {
        if (intervalRef.current) {
        clearInterval(intervalRef.current);
        }
    };
}, [isRunning, timeLeft]);
const handleStart = () => setIsRunning(true);
const handlePause = () => setIsRunning(false);
const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialMinutes * 60);
};
return (
<div className={styles.container}>
    <div className={styles.wave_container}>
    {/* Simple fill from bottom - no animation, no time display */}
    <div
        className={styles.wave_fill}
        style={{ height: `${progress}%` }}
    />
    </div>
    {/* Control buttons */}
    <div className={styles.controls}>
    {!isRunning ? (
        <button onClick={handleStart} className={styles.btn_start}>
        Start
        </button>
    ) : (
        <button onClick={handlePause} className={styles.btn_pause}>
        Pause
        </button>
    )}
    <button onClick={handleReset} className={styles.btn_reset}>
        Reset
    </button>
    </div>
</div>
);
};

export default WaveTimer;