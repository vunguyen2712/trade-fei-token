import React, { useState } from 'react';
import '../trade-view/TradeView.css';

const SellView = ({ balance, ratesAndFees: { feiToUsdRate, feiToEthRate, swapFeePercentage }, setBalance }) => {
    const [tradingAmount, setTradingAmount] = useState(0)
    const [usdVal, setUsdVal] = useState(0)
    const [receivedTokenVal, setReceivedTokenVal] = useState(0)
    const [minReceived, setMinReceived] = useState(0)

    const updateTradingAmount = (amount) => {
        setTradingAmount(amount)
        setUsdVal(amount * feiToUsdRate)
        let ethReceived = feiToEthRate * amount
        setReceivedTokenVal(ethReceived)
        setMinReceived(ethReceived - swapFeePercentage / 100 * ethReceived)
    }
    const sellFeiMax = () => {
        updateTradingAmount(balance.FEI)
    }

    const handleAmountInputOnChange = ({ target: { value: newVal } }) => {
        updateTradingAmount(newVal)
    }

    const executeSell = () => {
        setBalance({
            ETH: balance.ETH + minReceived,
            FEI: balance.FEI - tradingAmount,
        })
    }

    return (
        <>
            <div className='balance-container'>
                <div className='balance'><span>{`BALANCE: ${balance.FEI} FEI`}</span></div>
                <button className='max-btn'>
                    <div className='max-btn-inner-container'>
                        <div className='max-btn-title' onClick={sellFeiMax}> MAX</div>
                    </div>
                </button>
            </div>
            <div className='amount-container'>
                <input className='amount-input' value={tradingAmount} onChange={handleAmountInputOnChange} type='number' min='0' />
                {/* FEI svg goes here */}
                <div className='from-token'>FEI</div>
            </div>
            <div className='usd-value-container'>
                <div className='usd-value-title'>USD VALUE</div>
                <div className='usd-value'>{`$${usdVal}`}</div>
            </div>
            <div className='received-token-container'>
                <div className='received-token-value-container'>
                    <div className='received-token-value'>{receivedTokenVal}</div>
                </div>
                {/* svg ETH goes here */}
                <div className='received-token'>ETH</div>
            </div>
            <div className='min-received-container'>
                <div className='min-received-title'>MIN RECEIVED</div>
                <div className='min-received-value-container'>
                    <div className='min-received-value'>{`${minReceived} ETH`}</div>
                    <div className='slippage-tolerance'>
                        {/* svg for info goes here */}
                    </div>
                </div>
            </div>
            <div className='buy-sell-btn-container'>
                <button className='buy-sell-btn sell-btn' onClick={executeSell}>
                    <div className='buy-sell-btn-text'>Sell FEI</div>
                </button>
            </div>
        </>
    )
}

export default SellView;