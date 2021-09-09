import React, { useState } from 'react';
import { data } from '../../utils/mockData.js';
import { useAlert } from 'react-alert'
import { formatTokenVal, formatUSD, formatNumberInput, ETH_MAX_DECIMALS, FEI_MAX_DECIMALS } from '../../utils/numberFormat'
import Tooltip from '../../components/tooltips/Tooltip'
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
    const [usdVal, setUsdVal] = useState(0)
    const [receivedTokenVal, setReceivedTokenVal] = useState(0)
    const [minReceived, setMinReceived] = useState(0)
    const maxTokenDecimals = isBuyState ? FEI_MAX_DECIMALS : ETH_MAX_DECIMALS
    const balanceDecimals = isBuyState ? ETH_MAX_DECIMALS : FEI_MAX_DECIMALS

    /**
     * Reset the form when trading state is switched.
     * @returns {number}
     */
    const resetForm = () => {
        setTradingAmount('')
        setUsdVal(0)
        setReceivedTokenVal(0)
        setMinReceived(0)
        setTradingAmountError(null)
    }

    /**
     * Switch trading state - Buy or Sell.
     * @param {string} tradeState
     */
    const switchTrade = (tradeState) => {
        if (tradeState === 'buy') setIsBuyState(true)
        else setIsBuyState(false);
        resetForm()
    }

    /**
     * Get the rates for either Buy or Sell state.
     * @returns {object}
     */
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

    /**
     * Update the states
     * @param {number} amount
     */
    const updateTradingAmount = (amount) => {
        const rates = getRates()
        setTradingAmount(amount)
        setUsdVal(amount * rates.toUsdRate)
        const amountReceived = rates.toOtherTokenRate * amount
        setReceivedTokenVal(amountReceived)
        const minAmountReceived = amountReceived - rates.swapFeePercentage / 100 * amountReceived
        setMinReceived(minAmountReceived)
    }

    /**
     * Handle Max button being clicked
     */
    const tradeMax = () => {
        const currentBalance = isBuyState ? balance.ETH : balance.FEI
        updateTradingAmount(formatNumberInput(currentBalance, balanceDecimals))
    }

    /**
     * Handle onChange input of tradingAmount field.
     * @param {string} newVal
     */
    const handleAmountInputOnChange = ({ target: { value: newVal } }) => {
        if (tradingAmountError) setTradingAmountError(null)
        updateTradingAmount(parseFloat(newVal))
    }

    /**
     * Execute the trade Buy/Sell.
     */
    const executeTrade = () => {
        if (isBuyState) {
            setBalance({
                ETH: formatNumberInput(balance.ETH - tradingAmount, ETH_MAX_DECIMALS),
                FEI: formatNumberInput(balance.FEI + minReceived, FEI_MAX_DECIMALS),
            })
            alert.show(`You have purchased ${formatTokenVal(minReceived, maxTokenDecimals)} FEI.`)
        } else {
            setBalance({
                ETH: formatNumberInput(balance.ETH + minReceived, ETH_MAX_DECIMALS),
                FEI: formatNumberInput(balance.FEI - tradingAmount, FEI_MAX_DECIMALS),
            })
            alert.show(`You have received ${formatTokenVal(minReceived, maxTokenDecimals)} ETH.`)
        }
        setTradingAmountError(null)
    }

    /**
     * Handle the trade when Buy/Sell button is clicked and check errors.
     */
    const trade = () => {
        const currentBalance = isBuyState ? balance.ETH : balance.FEI
        const balanceNumber = formatNumberInput(currentBalance, balanceDecimals)
        const tradingAmountNumber = formatNumberInput(tradingAmount, balanceDecimals)
        if (tradingAmountNumber > balanceNumber) {
            setTradingAmountError('Insufficient balance')
        } else if (tradingAmountNumber <= 0) {
            setTradingAmountError(`Enter a valid ${isBuyState ? 'ETH' : 'FEI'} amount`)
        } else if (tradingAmountNumber <= balanceNumber) {
            executeTrade()
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
                        <span>{`BALANCE: ${isBuyState ? `${formatTokenVal(balance.ETH, balanceDecimals)} ETH` : `${formatTokenVal(balance.FEI, balanceDecimals)} FEI`}`}</span>
                    </div>
                    <button className='max-btn'>
                        <div className='max-btn-inner-container'>
                            <div className='max-btn-title' onClick={tradeMax}> MAX</div>
                        </div>
                    </button>
                </div>
                <div className='amount-container'>
                    <input className={`amount-input ${tradingAmountError ? 'input-error' : ''}`} value={tradingAmount} onChange={handleAmountInputOnChange} type='number' min='0' />
                    <div className='icon'><img src={isBuyState ? ETH_ICON : FEI_ICON} alt="ETH icon" /></div>
                    <div className='from-token'>{isBuyState ? 'ETH' : 'FEI'}</div>
                </div>
                <div className='usd-value-container'>
                    <div className='usd-value-title'>USD VALUE</div>
                    <div className='usd-value'>{formatUSD(usdVal)}</div>
                </div>
                <div className='received-token-container'>
                    <div className='received-token-value-container'>
                        <div className='received-token-value'>{formatTokenVal(receivedTokenVal, maxTokenDecimals)}</div>
                    </div>
                    <div className='icon'><img src={isBuyState ? FEI_ICON : ETH_ICON} alt="FEI icon" /></div>
                    <div className='received-token'>{isBuyState ? 'FEI' : 'ETH'}</div>
                </div>
                <div className='min-received-container'>
                    <div className='min-received-title'>MIN RECEIVED</div>

                    <div className='min-received-value-container'>
                        <div className='min-received-value'>{`${formatTokenVal(minReceived, maxTokenDecimals)} ${isBuyState ? 'FEI' : 'ETH'}`}</div>
                        <div className='info-icon'>
                            <Tooltip content={`SLIPPAGE TOLERANCE ${swapFeePercentage}%`} />
                            <img src={INFO_ICON} alt="Info icon" />
                        </div>
                    </div>
                </div>
                <div className='buy-sell-btn-container'>
                    <button className={`buy-sell-btn ${isBuyState ? 'buy-btn' : 'sell-btn'}`} onClick={trade}>
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