export const ETH_MAX_DECIMALS = 6
export const FEI_MAX_DECIMALS = 2

/**
 * Format token value with thousand separator ',' using US locale
 * @param {number} number
 * @param {number} maxDecimals
 * @returns {string}
 */
export const formatTokenVal = (number, maxDecimals) => {
    return parseFloat(number).toLocaleString('en-US', { maximumFractionDigits: maxDecimals })
}

/**
 * Format USD currency
 * @param {number} number
 * @returns {string}
 */
export const formatUSD = (number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(number))
}

/**
 * Format string numbers for doing Math on them
 * @param {string} numberStr
 * @param {number} maxDecimals
 * @returns {number}
 */
export const formatNumberInput = (numberStr, maxDecimals) => {
    return parseFloat(parseFloat(numberStr).toFixed(maxDecimals))
}