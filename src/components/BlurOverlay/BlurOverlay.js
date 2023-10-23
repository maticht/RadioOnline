import React from 'react';
import './BlurOverlay.css';

const BlurOverlay = ({ show }) => {
    return show ? <div className="blur-overlay"></div> : null;
};

export default BlurOverlay;