 import styles from './Session.module.css'
// import { useNavigate } from 'react-router-dom'
// import { useState } from 'react'
import Timer from '../Components/Timer'

const Session: React.FC = () => {
    // const navigate = useNavigate();

    return (
        <>
        <div className = {styles.sessionContainer}>
        <div className='flex justify-center mt-[4rem]'>
            <Timer/>
        </div>
        </div>
        </>
    )
}

export default Session