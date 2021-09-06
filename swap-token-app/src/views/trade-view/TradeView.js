import React, { useState } from 'react';
import { data } from '../../utils/mockData.js';
import { useAlert } from 'react-alert'
import { formatTokenVal, TOKEN_MAX_DECIMALS } from '../../utils/numberFormat'
import './TradeView.css';
import ETH_ICON from '../../assets/ETH-icon.svg'
import FEI_ICON from '../../assets/FEI-icon.svg'
import INFO_ICON from '../../assets/info-icon.svg'

const TradeView = () => {
    const alert = useAlert()
    const { balance: balanceData, ratesAndFees } = data;
    const { ethToUsdRate, ethToFeiRate, swapFeePercentage, feiToUsdRate, feiToEthRate } = ratesAndFees
    const [balance, setBalance] = useState(balanceData)
    const [isBuyState, setIsBuyState] = useState(true)
    const [tradingAmount, setTradingAmount] = useState('')
    const [tradingAmountError, setTradingAmountError] = useState(null)
    const [usdVal, setUsdVal] = useState('0')
    const [receivedTokenVal, setReceivedTokenVal] = useState('0')
    const [minReceived, setMinReceived] = useState('0')

    const resetForm = () => {
        setTradingAmount('')
        setUsdVal('0')
        setReceivedTokenVal('0')
        setMinReceived('0')
        setTradingAmountError(null)
    }

    const switchTrade = (trade) => {
        if (trade === 'buy') setIsBuyState(true)
        else setIsBuyState(false);
        resetForm()
    }

    const getRates = () => {
        const ethRates = {
            toUsdRate: ethToUsdRate,
            toOtherTokenRate: ethToFeiRate,
            swapFeePercentage
        }
        const feiRates = {
            toUsdRate: feiToUsdRate,
            toOtherTokenRate: feiToEthRate,
            swapFeePercentage
        }
        return isBuyState ? ethRates : feiRates
    }

    const updateTradingAmount = (amount) => {
        const rates = getRates()
        setTradingAmount(amount)
        setUsdVal((amount * rates.toUsdRate).toFixed(2))
        let amountReceived = rates.toOtherTokenRate * amount
        setReceivedTokenVal(formatTokenVal(amountReceived, TOKEN_MAX_DECIMALS))
        let minAmountReceived = amountReceived - rates.swapFeePercentage / 100 * amountReceived
        setMinReceived(formatTokenVal(minAmountReceived, TOKEN_MAX_DECIMALS))
    }
    const tradeMax = () => {
        const currentBalance = isBuyState ? balance.ETH : balance.FEI
        updateTradingAmount(currentBalance)
    }

    const handleAmountInputOnChange = ({ target: { value: newVal } }) => {
        if (tradingAmountError) setTradingAmountError(null)
        updateTradingAmount(newVal)
    }

    const adjustBalance = () => {
        if (isBuyState) {
            setBalance({
                ETH: balance.ETH - tradingAmount,
                FEI: balance.FEI + minReceived,
            })
            alert.show(`You have purchased ${minReceived} FEI.`)
            setTradingAmountError(null)
        } else {
            setBalance({
                ETH: balance.ETH + minReceived,
                FEI: balance.FEI - tradingAmount,
            })
            alert.show(`You have received ${minReceived} ETH.`)
            setTradingAmountError(null)
        }
    }

    const executeTrade = () => {
        const currentBalance = isBuyState ? balance.ETH : balance.FEI
        if (tradingAmount > currentBalance) {
            setTradingAmountError('Insufficient balance')
        } else if (tradingAmount <= 0) {
            setTradingAmountError(`Enter a valid ${isBuyState ? 'ETH' : 'FEI'} amount`)
        } else if (tradingAmount <= currentBalance) {
            adjustBalance()
        }
    }

    return (
        <>
            <div className='page-title'>Trade FEI</div>
            <div className='trade-container'>
                <div className='trade-inner-container'>
                    <div className={`trade-btn + ${isBuyState ? 'buy' : ''}`} onClick={() => switchTrade('buy')}>Buy</div>
                    <div className={`trade-btn + ${isBuyState ? '' : 'sell'}`} onClick={() => switchTrade('sell')}>Sell</div>
                </div>
                <div className='balance-container'>
                    <div className='balance'>
                        <span>{`BALANCE: ${isBuyState ? `${formatTokenVal(balance.ETH, TOKEN_MAX_DECIMALS)} ETH` : `${formatTokenVal(balance.FEI, TOKEN_MAX_DECIMALS)} FEI`}`}</span>
                    </div>
                    <button className='max-btn'>
                        <div className='max-btn-inner-container'>
                            <div className='max-btn-title' onClick={tradeMax}> MAX</div>
                        </div>
                    </button>
                </div>
                <div className='amount-container'>
                    <input className={`amount-input ${tradingAmountError ? 'input-error' : ''}`} value={tradingAmount} onChange={handleAmountInputOnChange} type='number' min='0' />
                    {/* ETh/FEI svg goes here */}
                    <div className='icon'><img src={isBuyState ? ETH_ICON : FEI_ICON} alt="ETH icon" /></div>
                    <div className='from-token'>{isBuyState ? 'ETH' : 'FEI'}</div>
                </div>
                <div className='usd-value-container'>
                    <div className='usd-value-title'>USD VALUE</div>
                    <div className='usd-value'>{`$${usdVal}`}</div>
                </div>
                <div className='received-token-container'>
                    <div className='received-token-value-container'>
                        <div className='received-token-value'>{receivedTokenVal}</div>
                    </div>
                    <div className='icon'><img src={isBuyState ? FEI_ICON : ETH_ICON} alt="FEI icon" /></div>
                    <div className='received-token'>{isBuyState ? 'FEI' : 'ETH'}</div>
                </div>
                <div className='min-received-container'>
                    <div className='min-received-title'>MIN RECEIVED</div>

                    <div className='min-received-value-container'>
                        <div className='min-received-value'>{`${minReceived} ${isBuyState ? 'FEI' : 'ETH'}`}</div>
                        <div className='info-icon'>
                            <img src={INFO_ICON} alt="Info icon" />
                        </div>
                    </div>
                </div>
                <div className='buy-sell-btn-container'>
                    <button className={`buy-sell-btn ${isBuyState ? 'buy-btn' : 'sell-btn'}`} onClick={executeTrade}>
                        <div className='buy-sell-btn-text'>{isBuyState ? 'Buy FEI' : 'Sell FEI'}</div>
                    </button>
                </div>
            </div>
            <div className='error-msg-container'>
            <div className={`error-msg-inner-container  ${tradingAmountError ? 'error-final-pos' : 'error-init-pos'}`}>
                    <div className='error-msg'>{tradingAmountError}</div>
                </div>
            </div>
        </>
    )
}

export default TradeView;