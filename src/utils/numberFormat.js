export const TOKEN_MAX_DECIMALS = 6
export const TOKEN_MIN_DECIMALS = 2

export const formatTokenVal = (number, maxDecimals) => {
    return parseFloat(number).toLocaleString('en-US', { maximumFractionDigits: maxDecimals })
}

export const formatUSD = (number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(number))
}

export const formatNumberInput = (numberStr, maxDecimals) => {
    return parseFloat(parseFloat(numberStr).toFixed(maxDecimals))
}