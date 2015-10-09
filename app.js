var Monitor = require('./pageTest');

var url = 'http://image.baidu.com/search/wiseala?tn=wiseala&ie=utf8&from=index&fmpage=search&pos=sug&active=1&word=%E7%BE%8E%E5%A5%B3&sa=3&index=0#!search';
// var url = 'http://image.baidu.com/search/wiseala?tn=wiseala&ie=utf8&from=index&fmpage=search&pos=sug&active=1&word=%E7%BE%8E%E5%A5%B3&sa=3&index=0#!searchDisp/22/0/0/ippr_z2C$qAzdH3FAzdH3Fk_z&e3Bitri5p5f_z&e3Bkwt17_z&e3Bv54AzdH3Ft4w2jAzdH3FrtvAzdH3Ftpj4AzdH3Fwcau9kukukj1wkm9nw1cvj09udnmwuvn0bn88j1w_z&e3B3r2';
var monitor = new Monitor(url);
console.log('page监听地址：');
console.log(url);
monitor.capture(function(code){

    console.log(monitor.log); // from phantom
    console.log('done, exit [' + code + ']');
});
console.log('开始diff');
// monitor.on('error', function (data) {
//     console.error('[ERROR] ' + data);
// });
// monitor.diff(1436945301082, (new Date().getTime()), function(code){
//     console.log(monitor.log.info); // diff result
//     console.log('[DONE] exit [' + code + ']');

// });
