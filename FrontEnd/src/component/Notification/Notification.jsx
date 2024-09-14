import { useEffect, useState } from "react";
import styl from "./Notification.module.css";

const Non = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="30px"
      height="30px"
    >
      <path
        fill="#F44336"
        d="M21.5 4.5H26.501V43.5H21.5z"
        transform="rotate(45.001 24 24)"
      />
      <path
        fill="#F44336"
        d="M21.5 4.5H26.5V43.501H21.5z"
        transform="rotate(135.008 24 24)"
      />
    </svg>
  );
};

const Ok = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="30px"
      height="30px"
    >
      <linearGradient
        id="HoiJCu43QtshzIrYCxOfCa"
        x1="21.241"
        x2="3.541"
        y1="39.241"
        y2="21.541"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset=".108" stop-color="#0d7044" />
        <stop offset=".433" stop-color="#11945a" />
      </linearGradient>
      <path
        fill="url(#HoiJCu43QtshzIrYCxOfCa)"
        d="M16.599,41.42L1.58,26.401c-0.774-0.774-0.774-2.028,0-2.802l4.019-4.019	c0.774-0.774,2.028-0.774,2.802,0L23.42,34.599c0.774,0.774,0.774,2.028,0,2.802l-4.019,4.019	C18.627,42.193,17.373,42.193,16.599,41.42z"
      />
      <linearGradient
        id="HoiJCu43QtshzIrYCxOfCb"
        x1="-15.77"
        x2="26.403"
        y1="43.228"
        y2="43.228"
        gradientTransform="rotate(134.999 21.287 38.873)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stop-color="#2ac782" />
        <stop offset="1" stop-color="#21b876" />
      </linearGradient>
      <path
        fill="url(#HoiJCu43QtshzIrYCxOfCb)"
        d="M12.58,34.599L39.599,7.58c0.774-0.774,2.028-0.774,2.802,0l4.019,4.019	c0.774,0.774,0.774,2.028,0,2.802L19.401,41.42c-0.774,0.774-2.028,0.774-2.802,0l-4.019-4.019	C11.807,36.627,11.807,35.373,12.58,34.599z"
      />
    </svg>
  );
};








const Request = (val) => {



    const [notif, setNotif] = useState([

    

        {
            user_name: "User",
            user_avatar: "./img/fraind.jpeg",
            user_notif: "Game"
        },
        {
            user_name: "azarda",
            user_avatar: "./img/azarda.png",
            user_notif: "Game"
        },
        {
            user_name: "azarda",
            user_avatar: "./img/azarda.png",
            user_notif: "Game"
        },
        {
            user_name: "azarda",
            user_avatar: "./img/azarda.png",
            user_notif: "Game"
        },
        {
            user_name: "azarda",
            user_avatar: "./img/azarda.png",
            user_notif: "Game"
        },
        {
            user_name: "azarda",
            user_avatar: "./img/azarda.png",
            user_notif: "Game"
        },
        {
            user_name: "azarda",
            user_avatar: "./img/azarda.png",
            user_notif: "Game"
        },
        {
            user_name: "azarda",
            user_avatar: "./img/azarda.png",
            user_notif: "Game"
        },
        {
            user_name: "User",
            user_avatar: "./img/fraind.jpeg",
            user_notif: "Game"
        },
        {
            user_name: "User",
            user_avatar: "./img/fraind.jpeg",
            user_notif: "Pending"
        },


    ])



    return (


        <div className={styl.pendin}>
        <h2>{`${val.val} request`}</h2>




        <div className={styl.all_notif}>

       { (notif.map((not) =>  val.val == not.user_notif && ( <div className={styl.notif} key={not.user_notif} >
          {/* <h4>.</h4> */}
          <img src={not.user_avatar} alt="" />
           <p>{`${not.user_name} sent you request `}
           {(val.val === "Pending") ? "friend" : "game" }</p>
            
          <button> <Ok /> </button>
          <button> <Non /></button>
        </div>)  ))}
        </div>
        </div>
    )

}








const Notification = () => {
  useEffect(() => {
    document.title = "Notification";
  });

  return (
    <div className={styl.notification}>
      <h1>NOTIFICATION</h1>

      <Request val={"Pending"} />
      <Request val={"Game"} />

    </div>
  );
};

export default Notification;
