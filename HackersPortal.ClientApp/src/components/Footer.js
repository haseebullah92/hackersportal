import React from 'react';

const Footer = () => {
  return (
    <div>
      <footer className="sticky-footer">
        <div className="container">
          <div className="text-center">
            <small>Copyright © Your Website 2017</small>
          </div>
        </div>
      </footer>
      <a className="scroll-to-top rounded" href="#page-top">
        <i className="fa fa-angle-up"></i>
      </a>
    </div>
  )
}

export default Footer;