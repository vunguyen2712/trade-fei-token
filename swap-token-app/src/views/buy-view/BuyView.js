import React, { useState } from 'react';
import '../trade-view/TradeView.css';

const BuyView = ({ balance, ratesAndFees: { ethToUsdRate, ethToFeiRate, swapFeePercentage }, setBalance }) => {
    const [tradingAmount, setTradingAmount] = useState(0)
    const [usdVal, setUsdVal] = useState(0)
    const [receivedTokenVal, setReceivedTokenVal] = useState(0)
    const [minReceived, setMinReceived] = useState(0)


    const updateTradingAmount = (amount) => {
        setTradingAmount(amount)
        setUsdVal(amount * ethToUsdRate)
        let feiReceived = ethToFeiRate * amount
        setReceivedTokenVal(feiReceived)
        setMinReceived(feiReceived - swapFeePercentage / 100 * feiReceived)
    }
    const buyFeiMax = () => {
        updateTradingAmount(balance.ETH)
    }

    const handleAmountInputOnChange = ({ target: { value: newVal } }) => {
        updateTradingAmount(newVal)
    }

    const executeBuy = () => {
        setBalance({
            ETH: balance.ETH - tradingAmount,
            FEI: balance.FEI + minReceived,
        })
    }

    return (
        <>
            <div className='balance-container'>
                <div className='balance'><span>{`BALANCE: ${balance.ETH} ETH`}</span></div>
                <button className='max-btn'>
                    <div className='max-btn-inner-container'>
                        <div className='max-btn-title' onClick={buyFeiMax}> MAX</div>
                    </div>
                </button>
            </div>
            <div className='amount-container'>
                <input className='amount-input' value={tradingAmount} onChange={handleAmountInputOnChange} type='number' min='0' />
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
                <button className='buy-sell-btn buy-btn' onClick={executeBuy}>
                    <div className='buy-sell-btn-text'>Buy FEI</div>
                </button>
            </div>
        </>
    )
}

export default BuyView;