import React from 'react';
import logoSvg from '../../img/A.svg';
import logoPng from '../..//img/A.png';
import './logo.css';

const Logo = ({ title, height = 150, outerStyle }) => {
  return (
    <div className="logo-wrap logo-center" style={outerStyle}>
      <object className="logo" data={logoSvg} type="image/svg+xml" style={{ height }}>
        <img className="logo" src={logoPng} alt="Search and Rescue logo" style={{ height }} />
      </object>
      {title && <h2 className="logo-title">{title}</h2>}
    </div>
  );
};

export default Logo;
