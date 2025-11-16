import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Timer.module.css'

const Timer: React.FC = () => {
    const location = useLocation();
    const initialDuration = location.state?.duration || 25;

    const [timeLeft, setTimeLeft] = useState(initialDuration * 60); 
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<number | null>(null);

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

    const formatTime = (seconds:number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStart = () => {
        setIsRunning(true);
    }

    const handlePause = () => {
        setIsRunning(false);
    }

    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(initialDuration * 60);
    }

    return (
        <>
        <div className={styles.container}>
            <p className={styles.time}>{formatTime(timeLeft)}</p>
            <div className='flex gap-4'>
                {!isRunning ? (
                    <button onClick={handleStart}> Start </button>
                ) : (
                    <button onClick={handlePause}> Pause </button>
                )}
                <button onClick={handleReset}> Reset </button>
            </div>
        </div>
        </>
    )  
}

export default Timer