'use strict';

var _browser = require('./browser');

var _browser2 = _interopRequireDefault(_browser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Preview = {
    initBigImg: function initBigImg() {
        if (true || !_browser2.default.versions.mobile) {
            var imgDoms = $('.post-page').find('img');
            imgDoms.on('click', function (e) {
                var $img = $(this),
                    imgSrc = $img.prop('src');

                //onsole.log('点击了图片', imgSrc)
                generateBigImg(imgSrc);
            });

            $('body').on('click', '.preview-mask', function (e) {
                var $this = $(this);
                $this.remove();
            });
        }
    }

};

function generateBigImg(src) {

    var mask = '\n            <div class="preview-mask">\n                <img src="PREVIEW_SRC" alt="\u9884\u89C8\u56FE\u7247">\n            </div>\n        ';
    mask = mask.replace('PREVIEW_SRC', src);

    $('body').append($(mask));
}

module.exports = Preview;