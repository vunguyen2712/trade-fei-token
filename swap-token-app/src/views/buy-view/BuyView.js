import React, { useState } from 'react';
import '../trade-view/TradeView.css';

const BuyView = ({data}) => {
    console.log('buy-view', data)
    const [balance, setBalance] = useState('0')
    const [minReceived, setMinReceived] = useState('3,824.55')
    const [usdVal, setUsdVal] = useState('3,868.02')
    const [receivedTokenVal, setReceivedTokenVal] = useState('3,843.76')

    return (
        <>
            <div className='balance-container'>
                <div><span>{`BALANCE: ${} ETH` }</span></div>
                <button>MAX</button>
            </div>
            <div className='amount-container'>
                <input className='amount-input' />
                {/* ETH svg goes here */}
                <div className='from-token'>ETH</div>
            </div>
            <div className='usd-value-container'>
                <div className='usd-value-title'>USD VALUE</div>
                <div className='usd-value'>{`$${usdVal}`}</div>
            </div>
            <div className='received-token-container'>
                <div className='received-token-value-container'>
                    <div className='received-token-value'>{receivedTokenVal}</div>
                </div>
                {/* svg FEI goes here */}
                <div className='received-token'>FEI</div>
            </div>
            <div className='min-received-container'>
                <div className='min-received-title'>MIN RECEIVED</div>
                <div className='min-received-value-container'>
                    <div className='min-received-value'>{`${minReceived} FEI`}</div>
                    <div className='slippage-tolerance'>
                        {/* svg for info goes here */}
                    </div>
                </div>
            </div>
            <div className='buy-sell-btn-container'>
                <button className='buy-sell-btn buy-btn'>
                    <div className='buy-sell-btn-text'>Buy FEI</div>
                </button>
            </div>
        </>
    )
}

export default BuyView;