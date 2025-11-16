import styles from './Dashboard.module.css'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import Navbar from '../../components/NavBar/NavBar';


const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [selectedEnviroment, setSelectEnviroment] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<number | null>(null);

    const canStartSession = selectedEnviroment != null && selectedTime != null
    const handleStartSession = () => {
        if (canStartSession) {
            navigate('/session', {
                state: {
                    duration: selectedTime,
                    enviroment: selectedEnviroment
                }
            });
        }
    }
    return (
        <>
        <Navbar />
        <div className={styles.container}>
            <div className={styles.mission_box}>
                <div className={styles.mission_badge}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M13.0221 14.1073H10.8518V13.0221H9.76659V10.8518H10.8518V9.76659H13.0221V10.8518H14.1073V13.0221H13.0221V14  1073ZM15.1925 18.448H8.68142V17.3628H7.59624V16.2777H6.51106V15.1925H5.42588V8.68142H6.51106V7.59624H7.59624V6.51106H8.68142V5.42588H15.1925V6.51106H16.2777V7.59624H17.3628V8.68142H18.448V15.1925H17.3628V16.2777H16.2777V17.3628H15.1925V18.448ZM16.2777 22.7887H7.59624V21.7035H5.42588V20.6184H4.34071V19.5332H3.25553V18.448H2.17035V16.2777H1.08517V7.59624H2.17035V5.42588H3.25553V4.34071H4.34071V3.25553H5.42588V2.17035H7.59624V1.08517H16.2777V2.17035H18.448V3.25553H19.5332V4.34071H20.6184V5.42588H21.7035V7.59624H22.7887V16.2777H21.7035V18.448H20.6184V19.5332H19.5332V20.6184H18.448V21.7035H16.2777V22.7887ZM14.1073 16.2777V15.1925H15.1925V14.1073H16.2777V9.76659H15.1925V8.68142H14.1073V7.59624H9.76659V8.68142H8.68142V9.76659H7.59624V14.1073H8.68142V15.1925H9.76659V16.2777H14.1073ZM15.1925 20.6184V19.5332H17.3628V18.448H18.448V17.3628H19.5332V15.1925H20.6184V8.68142H19.5332V6.51106H18.448V5.42588H17.3628V4.34071H15.1925V3.25553H8.68142V4.34071H6.51106V5.42588H5.42588V6.51106H4.34071V8.68142H3.25553V15.1925H4.34071V17.3628H5.42588V18.448H6.51106V19.5332H8.68142V20.6184H15.1925Z" fill="#5D608A"/></svg>
                    <p>Daily Mission</p>
                </div>
                <p className='font-Abel text-[20px]'> Complete a 25-minute flow state</p>
                <p className='font-Abel text-[16px]'>Let's today with a warm-up. You'll earn 20 bonus notes for completing this quest!</p>
            </div>
            <div className={styles.enviroment_box}>
                <p className='font-Abel text-[20px]'>Choose your flow environment</p>
                <div className={styles.enviroments}>
                    <div 
                        onClick={() => setSelectEnviroment(selectedEnviroment === 'underwater' ? null : 'underwater')}
                        className={selectedEnviroment === 'underwater' ? styles.selected : ''}
                    >
                        <p>Under The Sea</p>
                    </div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="57" height="57" viewBox="0 0 57 57" fill="none">
                        <path d="M23.6029 42.4852H30.6838V49.5661H23.6029V42.4852ZM40.1249 11.8014V25.9632H37.7646V28.3235H35.4043V30.6838H30.6838V35.4043H23.6029V28.3235H25.9632V25.9632H30.6838V23.6029H33.0441V14.1617H23.6029V16.522H21.2426V18.8823H16.522V11.8014H18.8823V9.44116H21.2426V7.08087H35.4043V9.44116H37.7646V11.8014H40.1249Z" fill="black"/>
                        </svg>
                        <p>Head to store to unlock new flow states</p>
                    </div>
                </div>
            </div>
            <div className={styles.time_box}>
            <p className='font-Abel text-[20px]'>How long do you want to focus?</p>
            <div className={styles.time_options}>
                <div
                    className={`${styles.time_option} ${selectedTime === 15 ? styles.selected : ''}`}
                    onClick={() => setSelectedTime(selectedTime === 15 ? null : 15)}
                >
                    <p className={styles.time_number}>15</p>
                    <p className={styles.time_label}>Minutes</p>
                </div>
                <div 
                    className={`${styles.time_option} ${selectedTime === 25 ? styles.selected : ''}`}
                    onClick={() => setSelectedTime(selectedTime === 25 ? null : 25)}
                >
                    <p className={styles.time_number}>25</p>
                    <p className={styles.time_label}>Minutes</p>
                </div>
                <div 
                    className={`${styles.time_option} ${selectedTime === 35 ? styles.selected : ''}`}
                    onClick={() => setSelectedTime(selectedTime === 35 ? null : 35)}
                >
                    <p className={styles.time_number}>35</p>
                    <p className={styles.time_label}>Minutes</p>
                </div>
                <div 
                    className={`${styles.time_option} ${selectedTime === 45 ? styles.selected : ''}`}
                    onClick={() => setSelectedTime(selectedTime === 45 ? null : 45)}
                >
                    <p className={styles.time_number}>45</p>
                    <p className={styles.time_label}>Minutes</p>
                </div>
            </div>
            <button
                className='hover:cursor-pointer'
                onClick={handleStartSession}
                disabled={!canStartSession}
            >
                Start Flow Session
            </button>
        </div>
        </div>
        </>
    )
}
export default Dashboard