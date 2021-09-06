export const TOKEN_MAX_DECIMALS = 6
export const TOKEN_MIN_DECIMALS = 2

export const formatTokenVal = (val, maxDecimals) => {
    return parseFloat(val).toLocaleString('en-US', { maximumFractionDigits: maxDecimals })
}

export const formatUSD = (number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(number))
}