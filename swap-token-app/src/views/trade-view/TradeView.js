import React, {useState} from 'react';
import './TradeView.css';
import {data} from './mockData.js';

const TradeView = () => {
    console.log(data)
    const [isBuy, setIsBuyState] = useState(true)
    const [minReceived, setMinReceived] = useState(0)

    const switchTrade = (trade) => {
        if (trade === 'buy') {
            setIsBuyState(true);
        } else {
            setIsBuyState(false);
        }
    }

    return (
        <>
            <div className='trade-container'> 
                <div className='buy-sell-container'>
                    <div className={`buy-sell-btn + ${isBuy ? 'buy' : ''}`} onClick={() => switchTrade('buy')}>Buy</div>
                    <div className={`buy-sell-btn + ${isBuy ? '' : 'sell'}`} onClick={() => switchTrade('sell')}>Sell</div>
                </div>
                <div className='balance-container'>
                    <div><span>Balance {}</span></div>
                    <button>MAX</button> 
                </div>
                <div className='amount-container'>
                    <input className='amount-input' />
                </div>
            </div>
        </>
    )
}

export default TradeView;