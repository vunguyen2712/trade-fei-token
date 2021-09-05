import React, { useState } from 'react';
import BuyView from '../buy-view/BuyView';
import SellView from '../sell-view/SellView'
import './TradeView.css';
import { data } from '../../utils/mockData.js';

const TradeView = () => {
    const {balance: balanceData, ratesAndFees} = data;
    const [balance, setBalance] = useState(balanceData)
    const [isBuyState, setIsBuyState] = useState(true)
    const [errorMsg, setErrorMsg] = useState(null)

    const switchTrade = (trade) => {
        if (trade === 'buy') setIsBuyState(true)
        else setIsBuyState(false);
    }

    const renderBuySellView = () => {
        if (isBuyState) return <BuyView balance={balance} ratesAndFees={ratesAndFees} setBalance={setBalance} setErrorMsg={setErrorMsg}/>
        else return <SellView balance={balance} ratesAndFees={ratesAndFees} setBalance={setBalance} setErrorMsg={setErrorMsg}/>
    }

    return (
        <>
            <div className='page-title'>Trade FEI</div>
            <div className='trade-container'>
                <div className='trade-inner-container'>
                    <div className={`trade-btn + ${isBuyState ? 'buy' : ''}`} onClick={() => switchTrade('buy')}>Buy</div>
                    <div className={`trade-btn + ${isBuyState ? '' : 'sell'}`} onClick={() => switchTrade('sell')}>Sell</div>
                </div>
                {renderBuySellView()}
            </div>
            {errorMsg && 
            <div className='error-msg-container'>
                <div className='error-msg-inner-container'>
                    <div className='error-msg'>{errorMsg}</div>
                </div>
            </div>}
        </>
    )
}

export default TradeView;