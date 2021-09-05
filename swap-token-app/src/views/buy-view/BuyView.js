import React, { useState } from 'react'
import { useAlert } from 'react-alert'
import '../trade-view/TradeView.css'

const BuyView = ({ balance, ratesAndFees: { ethToUsdRate, ethToFeiRate, swapFeePercentage }, setBalance, setErrorMsg }) => {
    const alert = useAlert()
    const [tradingAmount, setTradingAmount] = useState(0)
    const [tradingAmountError, setTradingAmountError] = useState(null)
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
        // reset old error msg
        let newValFloat = parseFloat(newVal)
        newValFloat = isNaN(newValFloat) ? 0 : newValFloat
        if (tradingAmountError) {
            setErrorMsg(null)
            setTradingAmountError(null)
        }
        if (newValFloat <= 0 || newValFloat > balance.ETH) {
            setTradingAmountError('Insufficient balance')
        }
        updateTradingAmount(newVal)
    }

    const executeBuy = () => {
        if (tradingAmount > balance.ETH) {
            setErrorMsg('Insufficient balance')
        } else if (tradingAmount <= 0) {
            setErrorMsg('Enter a valid ETH amount')
        } else if (tradingAmount <= balance.ETH) {
            setBalance({
                ETH: balance.ETH - tradingAmount,
                FEI: balance.FEI + minReceived,
            })
            alert.show(`You have purchased ${minReceived} FEI.`)
            setErrorMsg(null)
        }
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
                <input className={`amount-input ${tradingAmountError ? 'input-error' : ''}`} value={tradingAmount} onChange={handleAmountInputOnChange} type='number' min='0' />
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