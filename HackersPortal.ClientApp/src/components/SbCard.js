import React from 'react';

const SbCard = ({
  cardTitle,
  icon,
  colorType
}) => {
  return (
    <div className={`card text-white bg-${colorType} o-hidden h-100`}>
      <div className="card-body">
        <div className="card-body-icon">
          <i className={`fa fa-fw fa-${icon}`}></i>
        </div>
        <div className="mr-5">{cardTitle}</div>
      </div>
      <a className="card-footer text-white clearfix small z-1" href="#">
        <span className="float-left">View Details</span>
        <span className="float-right">
          <i className="fa fa-angle-right"></i>
        </span>
      </a>
    </div>
  )
}

export default SbCard;