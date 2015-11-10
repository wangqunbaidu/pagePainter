var Monitor = require('./pageTest');

var url = 'http://image.baidu.com/search/wiseala?tn=wiseala&ie=utf8&from=index&fmpage=search&pos=sug&active=1&word=%E7%BE%8E%E5%A5%B3&sa=3&index=0#!search';
var monitor = new Monitor(url);
console.log('page监听地址：');
console.log(url);
monitor.capture(function(code){

    console.log(monitor.log); // from phantom
    console.log('done, exit [' + code + ']');
});
console.log('开始diff');

