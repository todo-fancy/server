module.exports = (days) => {
  let date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}