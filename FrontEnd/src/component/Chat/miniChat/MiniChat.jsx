import React, { useState } from "react"
import "./MiniChat.css"
import Picker from 'emoji-picker-react';

const MiniChat = () => {


    const [listMsg , setListMsg] = useState([
        {
            id_user: "my_id",
            urlImg: "./img/azarda.png",
            date: "4:25 PM",
            msg: "salam "
        },


        
        {
            urlImg: "./img/khbouych.jpeg",
            id_user: "sssssssssss",
            date: "4:25 PM",
            msg: "Lorem ipsum dolor sit amet \
            consectetur adipisicing elit. Eligendi \
            tempore dolor labore doloribus quidem mollitia \
            molestiae assumenda magni possimus modi, quae incidunt \
            architecto et tempora rerum voluptatibus eos quaerat voluptatum!"
        },


        {
            id_user: "my_id",
            urlImg: "./img/azarda.png",
            date: "4:25 PM",
            msg: "Lorem ipsum dolor sit amet \
            consectetur adipisicing elit. Eligendi \
            tempore dolor labore doloribus quidem mollitia \
            molestiae assumenda magni possimus modi, quae incidunt \
            architecto et tempora rerum voluptatibus eos quaerat voluptatum!"
        },


        {
            id_user: "my_id",
            urlImg: "./img/azarda.png",
            date: "4:25 PM",
            msg: "Lorem ipsum dolor sit amet \
            consectetur adipisicing elit. Eligendi \
            tempore dolor labore doloribus quidem mollitia \
            molestiae assumenda magni possimus modi, quae incidunt \
            architecto et tempora rerum voluptatibus eos quaerat voluptatum!"
        },


        {
            id_user: "sssssssssss",
            urlImg: "./img/khbouych.jpeg",
            date: "4:25 PM",
            msg: "Lorem ipsum dolor sit amet \
            consectetur adipisicing elit. Eligendi \
            tempore dolor labore doloribus quidem mollitia \
            molestiae assumenda magni possimus modi, quae incidunt \
            architecto et tempora rerum voluptatibus eos quaerat voluptatum!"
        },



    
    ])



    // const pickerStyle  = {
    //     backgroundColor: 'rgba(255, 255, 255, 0.5)',
    //     color: 'red',
    //   };

    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");



    const AddEmoji =  (e) => {
        setText((prev) => prev + e.emoji);
    }


    const  handelSend = () => {

        if(text === "") return;
        
        console.log(text)
        
        setText("");
        
    }
    
    
    return (
        
        
        <div className="MiniChat"> 
        


                
            <div className="haut">

                <img src="./img/azarda.png" alt="" />

                    <div className="texts">
                        <span>azarda</span>
                        
                        <p>Online</p>
                    </div>


            </div>

            <div className="centre"   onClick={() =>  setOpen(false)} >













            { listMsg.map((mesag) =>
                    <div className={mesag.id_user == "my_id" ? "msg" : "msg_rcev"}  key={mesag.id_user} >
                    <div className="message">
                   {mesag.id_user !== "my_id" ? ( <img src={mesag.urlImg} alt="" />) : null}
                    <div className="text">
                    <span> {mesag.date} </span>
                    <p> {mesag.msg} </p>
                    </div>

                   {mesag.id_user === "my_id" ? ( <img src={mesag.urlImg} alt="" />) : null}

                    </div>

                </div>)  }






            </div>


            <div className="bouttom">

                <input className="puu" 
                    type="text" placeholder="Aa ... "  
                    onClick={() =>  setOpen(false)}
                    value={text}
                    onChange={(e) => setText(e.target.value)}

                    />

                <button className="btn">

                    <div className="emoji">

                    <img src="./icons/emojis.png" alt=""

                    onClick={() => { setOpen((prev) => !prev )}}
                    />

                <div className="picker">
                <Picker 
                    theme="dark"   
                    width={400} height={400}  
                    open={open} 
                    onEmojiClick={AddEmoji}
                    />
                    </div>
                </div>

                </button>


              { text &&  <button  
                    className="btn"
                    onClick={() => {
                        setOpen(false);
                        handelSend();
                    }}
                    > 
                    <img src="./icons/send.png" alt="" />
                </button>}

            </div>

        </div>
    )

}


export default MiniChat