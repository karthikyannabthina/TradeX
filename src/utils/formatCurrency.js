/** Format a number as Indian Rupees, e.g. 145030.5 -> "₹1,45,030.50" */
export function formatCurrency(value, { decimals = 2 } = {}) {
  const number = Number(value);

  if (Number.isNaN(number)) return "₹0.00";

  return number.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Format a raw change value with a leading +/- sign, e.g. 12.5 -> "+12.50" */
export function formatChange(value, { decimals = 2 } = {}) {
  const number = Number(value) || 0;
  const sign = number > 0 ? "+" : "";
  return `${sign}${number.toFixed(decimals)}`;
}

/** Format a change-percent value with sign and %, e.g. -0.5 -> "-0.50%" */
export function formatPercent(value, { decimals = 2 } = {}) {
  const number = Number(value) || 0;
  const sign = number > 0 ? "+" : "";
  return `${sign}${number.toFixed(decimals)}%`;
}

export default formatCurrency;
