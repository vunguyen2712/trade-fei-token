import React, { useState } from 'react';
import { useAlert } from 'react-alert'
import { formatTokenVal, TOKEN_MAX_DECIMALS } from '../../utils/numberFormat'
import '../trade-view/TradeView.css';

const SellView = ({ balance, ratesAndFees: { feiToUsdRate, feiToEthRate, swapFeePercentage }, setBalance, setErrorMsg }) => {
    const alert = useAlert()
    const [tradingAmount, setTradingAmount] = useState(0)
    const [tradingAmountError, setTradingAmountError] = useState(null)
    const [usdVal, setUsdVal] = useState(0)
    const [receivedTokenVal, setReceivedTokenVal] = useState(0)
    const [minReceived, setMinReceived] = useState(0)

    const updateTradingAmount = (amount) => {
        setTradingAmount(amount)
        setUsdVal((amount * feiToUsdRate).toFixed(2))
        let ethReceived = feiToEthRate * amount
        setReceivedTokenVal(formatTokenVal(ethReceived, TOKEN_MAX_DECIMALS))
        let minTokensReceived = ethReceived - swapFeePercentage / 100 * ethReceived
        setMinReceived(formatTokenVal(minTokensReceived, TOKEN_MAX_DECIMALS))
    }
    const sellFeiMax = () => {
        updateTradingAmount(balance.FEI)
    }

    const handleAmountInputOnChange = ({ target: { value: newVal } }) => {
        // reset old error msg
        let newValFloat = parseFloat(newVal)
        newValFloat = isNaN(newValFloat) ? 0 : newValFloat
        if (tradingAmountError) {
            setErrorMsg(null)
            setTradingAmountError(null)
        }
        if (newValFloat <= 0 || newValFloat > balance.FEI) {
            setTradingAmountError('Insufficient balance')
        }
        updateTradingAmount(newVal)
    }

    const executeSell = () => {
        if (tradingAmount > balance.FEI) {
            setErrorMsg('Insufficient balance')
        } else if (tradingAmount <= 0) {
            setErrorMsg('Enter a valid FEI amount')
        } else if (tradingAmount <= balance.FEI) {
            setBalance({
                ETH: balance.ETH + minReceived,
                FEI: balance.FEI - tradingAmount,
            })
            alert.show(`You have received ${minReceived} ETH.`)
            setErrorMsg(null)
        }
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
                <input className={`amount-input ${tradingAmountError ? 'input-error' : ''}`} value={tradingAmount} onChange={handleAmountInputOnChange} type='number' min='0' />
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