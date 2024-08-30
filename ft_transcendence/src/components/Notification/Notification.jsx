import styl from './Notification.module.css'
import userImage from './assets/nouahidi.jpeg'
import True from './assets/true.svg'
import False from './assets/false.svg'

const Notification = () => {
  return (
    <div className={styl.Notification}>
        <div className={styl.content}>
            <div className={styl.head}><h1>NOTIFICATION</h1></div>
            <div className={styl.cont}>
                <hr className={styl.line}/>
                <div className={styl.noti}>
                    <div className={styl.Request}>
                        <div className={styl.title}>
                            <h3 >Pending request</h3>
                        </div>
                        <div className={styl.card}>
                            <div className={styl.notiCard}> 
                                <div className={styl.userimage}>
                                    <img src={userImage}></img>
                                </div>
                                <div className={styl.Sender}>
                                    <p >noureddine sent you request friend</p>
                                </div>
                                <div className={styl.Icon}>
                                    <button >
                                        <img src={True}></img>
                                    </button>
                                    <button >
                                        <img src={False}></img>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styl.Request}>
                        <div className={styl.title}>
                            <h3 >Game request</h3>
                        </div>
                        <div className={styl.card}>
                            <div className={styl.notiCard}> 
                                <div className={styl.userimage}>
                                    <img src={userImage}></img>
                                </div>
                                <div className={styl.Sender}>
                                    <p >khbouych invit you for game</p>
                                </div>
                                <div className={styl.Icon}>
                                    <button >
                                        <img src={True}></img>
                                    </button>
                                    <button >
                                        <img src={False}></img>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Notification
