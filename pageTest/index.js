/**
*
*
**/
// 关于文件操作
// var fs = require('fs');
// 用于处理目录的对象
var path = require('path');
// url路径中的各个参数
var Url = require('url');
// 提供常用函数的集合,用于弥补核心JavaScript的功能
var util = require('util');
var _ = require('./util.js');
// 事件类
var EventEmitter = require('./eventEmitter');
// 实现创建多进程，以利用多核计算资源
var child_process = require('child_process');
// 通过生成一个子进程，去执行指定的命令
var spawn = child_process.spawn;
// 返回运行当前脚本的工作目录的path
var DEFAULT_DATA_DIRNAME = process.cwd();
// 关于文件操作
//var fs = require('fs');
// 默认配置文件
var config = require('./config.js');


// 路径合并
var CORE_DIR = path.join(__dirname, 'core');
var SPIDER_FILE = path.join(CORE_DIR, 'index.js');
// 判断文件存在

// phantomjs安装路径
var binPath = '/usr/local/bin/phantomjs';





/**
 * merge settings
 * @param {Object} settings
 * @returns {*}
 */
function setConfig(settings){
    config.path = {
        root: DEFAULT_DATA_DIRNAME, // data and screenshot save path root

        // save path format, it can be a string
        // like this: '{hostname}/{port}/{pathname}/{query}{hash}'
        format: function(url, opt){
            return [
                opt.hostname, (opt.port ? '-' + opt.port : ''), '/',
                _.encodeBase64(opt.path + (opt.hash || '')).replace(/\//g, '.')
                // base64(opt.path + (opt.hash || '')).replace(/\//g, '.')
            ].join('');
        }
    };
    // special handling of events
    if(settings && settings.events){
        _.map(settings.events, function(key, value){
            if(typeof value === 'function'){
                value = value.toString().replace(/^(function\s+)anonymous(?=\()/, '$1');
                settings.events[key] = value;
            }
        });
    }

    return _.merge(config, settings || {});
}



/**
 * path format
 * @param {String|Function} pattern
 * @param {String} url
 * @param {Object} opt
 * @returns {String}
 */
function format(pattern, url, opt){
    switch (typeof pattern){
        case 'function':
            return pattern(url, opt);
        case 'string':
            var pth = [];
            String(pattern).split('/').forEach(function(item){
                pth.push(item.replace(/\{(\w+)\}/g, function(m, $1){
                    return _.escapePath((opt[$1] || ''));
                }));
            });
            return pth.join('/');
        default :
            throw new Error('unsupport format');
    }
}

var LOG_VALUE_MAP ={};
var logTypes = (function(){
    var types = [];
    _.map(_.log, function(key, value){
        LOG_VALUE_MAP[value] = key.toLowerCase();
        types.push(_.escapeReg(value));
    });
    return types.join('|');
})();
var LOG_SPLIT_REG = new RegExp('(?:^|[\r\n]+)(?=' + logTypes + ')');
var LOG_TYPE_REG = new RegExp('^(' + logTypes + ')');



/**
 * Monitor Class Constructor
 * @param {String} url
 * @param {Object} options
 * @constructor
 */
var Monitor = function(url, options){
    EventEmitter.call(this);
    options = setConfig(options);
    this.url = options.url = url;
    this.running = false;
    options.path.dir = path.join(
        options.path.root || DEFAULT_DATA_DIRNAME,
        format(options.path.format, url, Url.parse(url))
    );
    options.path.dir = options.path.dir.substr(0, 100);
    //
    console.log('page级别产出目录：');
    console.log(options.path.dir);
    console.log('\n');
    if(!_.exists(options.path.dir)){
        // 创建产出host目录
        _.mkdir(options.path.dir);
    }
    this.options = options;
    
    this._initLog();
};

// inherit from EventEmitter
util.inherits(Monitor, EventEmitter);

/**
 * init log
 * @private
 */
Monitor.prototype._initLog = function(){
    var log = this.log = {};
    _.map(_.log, function(key){
        log[key.toLowerCase()] = [];
    });
};

/**
 * capture webpage and diff
 * @param {Function} callback
 * @param {Boolean} noDiff
 * @returns {*}
 */
Monitor.prototype.capture = function(callback, noDiff){
    // 加锁
    if(this.running) return;
    this.running = true;
    var self = this;
    var type = _.mode.CAPTURE;
    if(!noDiff){
        type |= _.mode.DIFF;
    }
    this._initLog();

    return this._phantom(
        [
            SPIDER_FILE,
            type,
            this.url,
            JSON.stringify(this.options)
        ],
        function(code, log){
            // TODO with code
            // 解锁

            self.running = false;
            callback.call(self, code, log);
        }
    );
};

/**
 * diff with two times
 * @param {Number|String|Date} left
 * @param {Number|String|Date} right
 * @param {Function} callback
 * @returns {*}
 */
Monitor.prototype.diff = function(left, right, callback){
    if(this.running) return;
    this.running = true;
    var self = this;
    var type = _.mode.DIFF;
    this._initLog();
    if(_.is(left, 'Date')){
        left = left.getDate();
    }
    if(_.is(right, 'Date')){
        right = right.getDate();
    }
    return this._phantom(
        [
            SPIDER_FILE,
            type, left, right,
            JSON.stringify(this.options)
        ],
        function(code, log){
            // TODO with code
            self.running = false;
            callback.call(self, code, log);
        }
    );
};

/**
 * 执行 phantom
 * @param {Array} args
 * @param {Function} callback
 * @returns {*}
 * @private
 */
Monitor.prototype._phantom = function(args, callback){
    var arr = [];
    _.map(this.options.cli, function(key, value){
        arr.push(key + '=' + value);
    });
    this.emit('debug', 'cli arguments: ' + JSON.stringify(arr));
    arr = arr.concat(args);
    
    console.log(arr);console.log(binPath);
    console.log('********');exit();
    var proc = spawn(binPath, arr);
    proc.stdout.on('data', this._parseLog.bind(this));
    proc.stderr.on('data', this._parseLog.bind(this));
    proc.on('exit', function(code){
        console.log(code); exit();
        callback(code);
    });
    console.log(proc);
    
    return proc;
};

/**
 * parse log from phantom
 * @param {String} msg
 * @private
 */
Monitor.prototype._parseLog = function(msg){
    exit();
    var self = this;
    String(msg || '').split(LOG_SPLIT_REG).forEach(function(item){
        item = item.trim();
        if(item){
            var type = 'debug';
            item = item.replace(LOG_TYPE_REG, function(m, $1){
                type = LOG_VALUE_MAP[$1] || type;
                return '';
            });
            self.emit(type, item);
            if(self.log.hasOwnProperty(type)){
                self.log[type].push(item);
            }
        }
    });
};

module.exports = Monitor;