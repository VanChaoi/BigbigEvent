//小于0的值,前面+1
function addZero(n) {
  return n < 10 ? "0" + n : n;
}
//转换为时分秒格式
function dateFormate(t) {
  var data = new Date(t);
  var y = addZero(data.getFullYear());
  var m = addZero(data.getMonth() + 1);
  var d = addZero(data.getDate());
  var h = addZero(data.getHours());
  var M = addZero(data.getMinutes());
  var s = addZero(data.getSeconds());
  return y + "-" + m + "-" + d + "-" + h + ":" + M + ":" + s;
}
