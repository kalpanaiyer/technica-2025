import AudioButton from "../components/AudioButton";
interface AudioCardProps {
  image: string;
  name: string;
  description: string;
  notes_amt: number;
  audio: string;
  purchased: boolean;
  onPurchaseClick: (name: string, price: number) => void;
}

const AudioCard: React.FC<AudioCardProps> = (props) => {
  return (
    <div className='bg-[#F0F8FF] rounded-[18px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] w-sm p-3'>

      <span className='flex gap-7'>
        <div className='w-40 flex justify-center items-center'>
          <img className="rounded-full bg-[#ADA7C9] p-4" src={props.image} alt="Audio Visual" />
        </div>

        <div className="flex-col">
          <p className='font-[Pixelify_Sans] text-[32px] font-bold'>{props.name}</p>
          <p className='text-xl mb-1'>{props.description}</p>
          <AudioButton audioPath={props.audio} />
        </div>
      </span>

      <span className="flex mt-5 justify-between">
        <span className="flex text-[#5D608A] gap-2">
          <img src="/images/music_note.svg" alt="Music Note" />
          <p className="text-2xl">{props.notes_amt} Notes</p>
        </span>

        <button 
          className={`px-10 rounded-full text-base w-[150px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]
          ${props.purchased ? 'bg-[#D9D9D9] cursor-not-allowed' : 'text-[#5D608A] bg-[#F4CAE080]/50 border border-black hover:cursor-pointer'}`}
          disabled={props.purchased}
          onClick={() => props.onPurchaseClick(props.name, props.notes_amt)}
        >
          {props.purchased ? 'Owned' : 'Purchase'}
        </button>
      </span>
      
    </div>
  )
};

export default AudioCard;