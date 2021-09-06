import React from 'react';
import './tooltip.css';

const Tooltip = ({ content }) => {
    return (
        <>
            <div className='tooltip'>
                <span className='tooltip-text'>{content}</span>
            </div>
        </>
    )
}

export default Tooltip;