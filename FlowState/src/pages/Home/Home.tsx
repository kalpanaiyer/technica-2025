import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className='bg-white/60 my-15 mx-25 p-15 rounded-[50px] backdrop-blur-[2px]'>
      <h1 className='text-[60px]'>Welcome to Flowstate</h1>
      <p className='text-[32px] mb-10'>Personalized Soundscapes: Focus Engineered for the Neurodivergent Brain</p>
    
    <span className='flex'>
      <div className={styles.featureBoxes}>
        <img src='/audioIcon.png' alt="Audio Icon" />
        <h2>Personalized Audio</h2>
        <p>Use AI to generate custom sounds.</p>
      </div>

      <div className={styles.featureBoxes}>
        <img src='/graphIcon.png' alt="Graph Icon" />
        <h2>Designed for Every Mind</h2>
        <p>No streak stress, just progress without pressure.</p>
      </div>

      <div className={styles.featureBoxes}>
        <img src='/starIcon.png' alt="Star Icon" />
        <h2>Level Up Your Focus</h2>
        <p>Earn tokens for every session and unlock new focus worlds as you grow.</p>
      </div>
    </span>

    <div onClick={() => navigate('/login')} className='flex items-center gap-5 justify-center transition-transform duration-200 hover:-translate-y-1 hover:cursor-pointer'>
      <p className='inline text-[40px]'>Enter your flowstate</p>
      <img className='inline' src='/pixelArrow.png' alt="Pixelated Arrow" />
    </div>
      

    </div>
  )
}

export default Home