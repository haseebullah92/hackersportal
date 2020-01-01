import React from 'react';

const ContainerCard = ({
  size,
  headerText,
  icon,
  children,
  footerText
}) => {
  return (
    <div className={`card mb-${size}`}>
      <div className="card-header">
        <i className={`fa fa-${icon}`}></i> {headerText}</div>
      <div className="card-body my-auto">
        {children}
      </div>
      <div className="card-footer small text-muted">{footerText}</div>
    </div>
  );
}

export default ContainerCard;