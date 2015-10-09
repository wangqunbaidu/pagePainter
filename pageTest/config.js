/**
* 默认配置
**/
var config = {
    // remove phantomejs application cache before capture
    // @see https://github.com/fouber/page-monitor/issues/3
    cleanApplicationCache: false,
    // phantom cli options
    // @see http://phantomjs.org/api/command-line.html
    cli: {
        '--max-disk-cache-size' : '0',
        '--disk-cache' : 'false',
        '--ignore-ssl-errors' : 'yes'
    },
    // webpage settings
    // @see http://phantomjs.org/api/webpage/
    page: {
        viewportSize: {
            width: 320,
            height: 568
        },
        settings: {
            resourceTimeout: 20000,
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53'
        }
    },
    walk: {
        invisibleElements : [
            'applet', 'area', 'audio', 'base', 'basefont',
            'bdi', 'bdo', 'big', 'br', 'center', 'colgroup',
            'datalist', 'form', 'frameset', 'head', 'link',
            'map', 'meta', 'noframes', 'noscript', 'optgroup',
            'option', 'param', 'rp', 'rt', 'ruby', 'script',
            'source', 'style', 'title', 'track', 'xmp'
        ],
        ignoreChildrenElements: [
            'img', 'canvas', 'input', 'textarea', 'audio',
            'video', 'hr', 'embed', 'object', 'progress',
            'select', 'table'
        ],
        styleFilters: [
            'margin-left', 'margin-top', 'margin-right', 'margin-bottom',
            'border-left-color', 'border-left-style', 'border-left-width',
            'border-top-color', 'border-top-style', 'border-top-width',
            'border-right-color', 'border-right-style', 'border-right-width',
            'border-bottom-color', 'border-bottom-style', 'border-bottom-width',
            'border-top-left-radius', 'border-top-right-radius',
            'border-bottom-left-radius', 'border-bottom-right-radius',
            'padding-left', 'padding-top', 'padding-right', 'padding-bottom',
            'background-color', 'background-image', 'background-repeat',
            'background-size', 'background-position',
            'list-style-image', 'list-style-position', 'list-style-type',
            'outline-color', 'outline-style', 'outline-width',
            'font-size', 'font-family', 'font-weight', 'font-style', 'line-height',
            'box-shadow', 'clear', 'color', 'display', 'float', 'opacity', 'text-align',
            'text-decoration', 'text-indent', 'text-shadow', 'vertical-align', 'visibility',
            'position'
        ],
        // attributes to mark an element
        attributeFilters: [ 'id', 'class' ],
        excludeSelectors: [],
        removeSelectors: [],          // remove elements before walk
        ignoreTextSelectors: [],      // ignore content change of text node or image change
        ignoreStyleSelectors: [],     // ignore style change
        ignoreChildrenSelectors: [],  //
        root: 'body'
    },
    diff: {
        // LCS diff priority, `head` or `tail`
        priority: 'head',
        // highlight mask styles
        highlight: {
            add: {
                title: '新增(Added)',
                backgroundColor: 'rgba(127, 255, 127, 0.3)',
                borderColor: '#090',
                color: '#060',
                textShadow: '0 1px 1px rgba(0, 0, 0, 0.3)'
            },
            remove: {
                title: '删除(Removed)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderColor: '#999',
                color: '#fff'
            },
            style: {
                title: '样式(Style)',
                backgroundColor: 'rgba(255, 0, 0, 0.3)',
                borderColor: '#f00',
                color: '#f00'
            },
            text: {
                title: '文本(Text)',
                backgroundColor: 'rgba(255, 255, 0, 0.3)',
                borderColor: '#f90',
                color: '#c30'
            }
        }
    },
    events: {
        init: function(token){
            /*
                do something before page init,
                @see http://phantomjs.org/api/webpage/handler/on-initialized.html
            */
        },
        beforeWalk: function(token){
            /*
                do something before walk dom tree,
                retrun a number to delay screenshot
             */
        }
    },
    render: {
        format: 'jpeg',     // @see http://phantomjs.org/api/webpage/method/render.html
        quality: 80,        // @see http://phantomjs.org/api/webpage/method/render.html
        ext: 'jpg',         // the same as format, if not specified
        delay: 1000,        // delay(ms) before screenshot.
        timeout: 60 * 1000  // render timeout, max waiting time
    }
    
};

module.exports = config;