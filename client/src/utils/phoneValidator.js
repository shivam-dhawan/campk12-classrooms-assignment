
module.exports = function (phone) {
  const re = /(5|6|7|8|9)\d{9}/;
  return re.test(phone);
};
