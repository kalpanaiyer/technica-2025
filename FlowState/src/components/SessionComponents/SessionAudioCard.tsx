import SessionAudioButton from "./SessionAudioButton";
// import {useState} from 'react';

interface AudioCardProps {
  image: string;
  name: string;
  description: string;
  notes_amt: number;
  audio: string;
}

// interface SoundItem {
//   name: string,
//   description: string,
//   audio: string,
//   image?: string
// }



const SessionAudioCard: React.FC<AudioCardProps> = (props) => {


  return (
    <div className="bg-[#F0F8FF] rounded-lg shadow p-2 max-w-[180px]">
      <span className="flex gap-2">
        <div className="w-12 flex justify-center items-center shrink-0">
          <img
            className="rounded-full bg-[#ADA7C9] p-1 h-10 w-10 object-cover"
            src={props.image}
            alt="Audio Visual"
          />
        </div>

        <div className="flex-col min-w-0">
          <p
            className="font-[Pixelify_Sans] text-sm font-bold truncate"
            title={props.name}
          >
            {props.name}
          </p>
          {/* <p className="text-xs mb-1 line-clamp-1" title={props.description}>
            {props.description}
          </p> */}
          <SessionAudioButton audioPath={props.audio} />
        </div>
      </span>
    </div>
  );
};

export default SessionAudioCard;
