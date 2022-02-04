import './message.css';
import {format} from 'timeago.js';


export default function Message({message, own}) {
  return (
      <div className={own ? "message own" : "message"}>

        <div className="messageTop"></div>
            <img className='messageImg' src="https://pbs.twimg.com/profile_images/1339121159623872513/rYEZIs0a_400x400.jpg" alt="" />
            <p className='messageText'>{message.text} </p>
        <div className="messageBottom">{format(message.createdAt)}</div>
      </div>
  )
}
