const formatNumber = (price) => {
  const cleanedPrice = price.toString().replace(/,/g, "");
  const value = Number(cleanedPrice);

  const dailyPrice = value / 30;

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(dailyPrice);
};

export default formatNumber;
