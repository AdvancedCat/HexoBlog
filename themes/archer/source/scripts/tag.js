'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initTag = undefined;

var _util = require('./util');

var initTag = function initTag() {
    var contentJSON = void 0,
        tagMap = new Map();
    initTagInfo();

    // 获取所有文章信息的json
    function initTagInfo() {
        // jsInfo is from js-info.ejs
        var tagURL = jsInfo.root + 'content.json?t=' + +new Date();
        var xhr = new XMLHttpRequest();
        xhr.responseType = '';
        xhr.open('get', tagURL, true);
        var $tagLoadFail = $('.tag-load-fail:first');
        xhr.onload = function () {
            if (this.status == 200 || this.status == 304) {
                $tagLoadFail.remove();
                contentJSON = JSON.parse(this.responseText);
                initTagMap(contentJSON);
            } else {
                showTagLoadFail($tagLoadFail);
                $('.sidebar-tags-name:first').remove();
            }
        };
        xhr.send();
    }

    // 显示加载失败
    function showTagLoadFail($tagLoadFail) {
        $tagLoadFail[0].style.display = 'block';
    }

    // 建立map
    function initTagMap(contentJSON) {
        var _this = this;

        var _loop = function _loop(postIndex) {
            var currPostTags = contentJSON[postIndex].tags;
            if (currPostTags.length) {
                currPostTags.forEach(function (tag) {
                    if (tagMap.has(tag.name)) {
                        var addedIndex = tagMap.get(tag.name) + ',' + postIndex.toString();
                        tagMap.set(tag.name, addedIndex);
                    } else {
                        tagMap.set(tag.name, postIndex.toString());
                    }
                }, _this);
            }
        };

        for (var postIndex = 0; postIndex < contentJSON.length; postIndex++) {
            _loop(postIndex);
        }
    }

    // 将对应的postInfo生成dom
    function createTagDom(postInfo) {
        var $tagItem = $('<li class="tag-post-item"><span class="tag-post-date">' + _util.archerUtil.dateFormater(new Date(Date.parse(postInfo.date)), 'yyyy/MM/dd') + '</span></li>');
        var $aItem = $('<a class="tag-post-title" href="' + jsInfo.root + postInfo.path + '">' + postInfo.title + '</a>');
        $tagItem.append($aItem);
        return $tagItem;
    }

    $('.sidebar-tags-name:first').on('click', function (event) {
        event.preventDefault();
        var realTarget = event.target;
        // 点击大框可显示对应tag的文章
        if (this.compareDocumentPosition(realTarget) & 16) {
            // 确定tagName
            if (realTarget.tagName === 'SPAN') {
                this.currTagName = realTarget.firstChild.innerHTML;
            } else {
                this.currTagName = realTarget.innerHTML;
            }
        }

        // 判断是否存在对应tag
        var indexs = tagMap.get(this.currTagName);
        if (!indexs) {
            return;
        }

        // 设置当前选中的tag的样式
        $(this).find('.sidebar-tag-name-focus').removeClass('sidebar-tag-name-focus');
        var children = this.children;
        for (var i = 0; i < children.length; i++) {
            if (this.currTagName === children[i].firstChild.innerHTML) {
                children[i].classList.add('sidebar-tag-name-focus');
            }
        }

        // 显示tag对应的文章列表
        var indexsArr = indexs.split(',');
        var frag = document.createDocumentFragment(),
            postList = document.getElementsByClassName('sidebar-tag-list')[0];
        postList.innerHTML = '';
        indexsArr.forEach(function (item) {
            frag.appendChild(createTagDom(contentJSON[item])[0]);
        });
        postList.appendChild(frag);
    });
};

exports.initTag = initTag;