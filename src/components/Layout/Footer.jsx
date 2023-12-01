import React from 'react';
import "./Layout.css";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="footer">
            <p>Created for INTELWEB</p>
            <p>Created by Temuri Sokhadze</p>
            <p>{currentYear}</p>
        </div>
    );
};

export default Footer;
