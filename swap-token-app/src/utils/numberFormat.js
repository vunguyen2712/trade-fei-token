export const TOKEN_MAX_DECIMALS = 6

export const formatTokenVal = (val, maxDecimals) => {
    return parseFloat(val.toFixed(maxDecimals));
}  