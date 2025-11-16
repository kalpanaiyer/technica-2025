import AudioButton from "../../components/AudioButton"
interface AudioCardProps {
  image: string;
  name: string;
  description: string;
  notes_amt: number;
  audio: string;
}

const SessionAudioCard: React.FC<AudioCardProps> = (props) => {
  return (
    <div className='bg-[#F0F8FF] rounded-lg shadow-md p-2 max-w-xs'>

      <span className='flex gap-4'>
        <div className='w-20 flex justify-center items-center flex-shrink-0'>
          <img className="rounded-full bg-[#ADA7C9] p-2 h-16 w-16 object-cover" src={props.image} alt="Audio Visual" />
        </div>

        <div className="flex-col min-w-0">
          <p className='font-[Pixelify_Sans] text-xl font-bold truncate' title={props.name}>{props.name}</p>
          <p className='text-sm mb-1 line-clamp-2' title={props.description}>{props.description}</p>
          <AudioButton audioPath={props.audio} />
        </div>
      </span>
      
    </div>
  )
};

export default SessionAudioCard;