import React from 'react'
import styl from './Card.module.css'


const Card = ({ children , width}) => {
  return (
    <div  className={styl.stlCard} style={{ width: width }} >{ children }</div>
  )
}

export default Card
