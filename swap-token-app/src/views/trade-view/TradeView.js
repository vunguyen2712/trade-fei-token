import React, {useState} from 'react';
import BuyView from '../buy-view/BuyView';
import SellView from '../sell-view/SellView'
import './TradeView.css';
import {data} from '../../utils/mockData.js';

const TradeView = () => {
    console.log('trade-view', data)
    const [isBuyState, setIsBuyState] = useState(true)

    const switchTrade = (trade) => {
        if (trade === 'buy') setIsBuyState(true);
        else setIsBuyState(false);
    }

    const renderBuySellView = () => {
        if (isBuyState) return <BuyView data={data}/>
        else return <SellView data={data}/>
    }

    return (
        <>
            <div className='trade-container'> 
                <div className='trade-inner-container'>
                    <div className={`trade-btn + ${isBuyState ? 'buy' : ''}`} onClick={() => switchTrade('buy')}>Buy</div>
                    <div className={`trade-btn + ${isBuyState ? '' : 'sell'}`} onClick={() => switchTrade('sell')}>Sell</div>
                </div>
                {renderBuySellView()}
            </div>
        </>
    )
}

export default TradeView;