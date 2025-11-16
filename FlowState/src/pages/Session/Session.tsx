import styles from './Session.module.css'
// import { useNavigate } from 'react-router-dom'
// import { useState } from 'react'
import Timer from '../Components/Timer'
import Todo from '../../components/Todo'

const Session: React.FC = () => {
    // const navigate = useNavigate();

    return (
        <>
        <div className = {styles.sessionContainer}>
        <div className='flex justify-center pt-16'>
            <Timer/>
        </div>
        <div className='flex justify-start mt-[1rem]'>
            <Todo/>
        </div>
        </>
    )
}

export default Session