/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _init = __webpack_require__(1);

	var _toggleHeader = __webpack_require__(2);

	var _mobile = __webpack_require__(3);

	var _sidebar = __webpack_require__(4);

	var _tag = __webpack_require__(5);

	var _preview = __webpack_require__(7);

	var _preview2 = _interopRequireDefault(_preview);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//onsole.info('hexo-theme-archer: v201701020');
	(0, _init.init)();
	(0, _toggleHeader.toggleHeader)();
	(0, _sidebar.sidebarInit)();
	(0, _tag.initTag)();
	(0, _mobile.initMobile)();

	_preview2.default.initBigImg();

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var init = function init() {
	    var $introImg = $('.site-intro-img:first'),
	        introPlaceholder = $('.site-intro-placeholder:first'),
	        bgCSS = $introImg.css('background-image'),
	        bgRegResult = bgCSS.match(/url\("*([^"]*)"*\)/);

	    if (bgRegResult.length < 2) {
	        console.log(bgRegResult);
	        return;
	    }

	    var bgURL = bgRegResult[1],
	        img = new Image();
	    img.onload = function () {
	        introPlaceholder.remove();
	        console.info('PLACEHOLDER REMOVED');
	    };
	    img.src = bgURL;
	};

	document.addEventListener('DOMContentLoaded', function () {
	    document.getElementsByClassName('container')[0].classList.remove('container-unloaded');
	    document.getElementsByClassName('container')[0].classList.add('container-footer-fade-in');
	    document.getElementsByClassName('footer')[0].classList.remove('footer-unloaded');
	    document.getElementsByClassName('footer')[0].classList.add('container-footer-fade-in');
	    document.getElementsByClassName('loading')[0].style.display = 'none';
	}, false);

	exports.init = init;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var toggleHeader = function toggleHeader() {
	    // 判断是否为post-page
	    var isPostPage = 0;
	    if (typeof document.getElementsByClassName('post-body')[0] !== 'undefined') {
	        isPostPage = 1;
	    }

	    var $banner = $('.banner:first'),
	        $postBanner = $banner.find('.post-title a'),
	        $bgEle = $('.site-intro:first'),
	        $homeLink = $('.home-link:first'),
	        $backTop = $('.back-top:first'),
	        $sidebarMenu = $('.header-sidebar-menu:first'),
	        bgTitleHeight = $bgEle.offset().top + $bgEle.outerHeight(),
	        $tocWrapper = $('.toc-wrapper:first'),
	        $tocCatalog = $tocWrapper.find('.toc-catalog');

	    // toc的收缩
	    $tocCatalog.on('click', function () {
	        $tocWrapper.find('.toc').toggleClass('toc-hide');
	    });

	    // 滚动式切换文章标题和站点标题    
	    var previousHeight = 0,
	        continueScroll = 0;

	    function isScrollingUpOrDown(currTop) {
	        continueScroll += currTop - previousHeight;
	        if (continueScroll > 50) {
	            // 向下滑动
	            continueScroll = 0;
	            return 1;
	        } else if (continueScroll < -50) {
	            //向上滑动
	            continueScroll = 0;
	            return -1;
	        } else {
	            return 0;
	        }
	    }

	    // 是否在向上或向下滚动
	    var crossingState = -1;
	    var isHigherThanIntro = true;
	    function isCrossingIntro(currTop) {
	        // 向下滑动超过intro
	        if (currTop > bgTitleHeight) {
	            if (crossingState !== 1) {
	                crossingState = 1;
	                isHigherThanIntro = false;
	                return 1;
	            }
	        } else {
	            // 向上滑动超过intro
	            if (crossingState !== -1) {
	                crossingState = -1;
	                isHigherThanIntro = true;
	                return -1;
	            }
	        }
	        return 0;
	    }

	    // 滚动回调
	    var ticking = false;
	    function scrollHandler(that) {
	        if (!ticking) {
	            requestAnimationFrame(function update() {
	                var scrollTop = $(document).scrollTop();
	                var crossingState = isCrossingIntro(scrollTop);
	                // intro边界切换
	                if (crossingState == 1) {
	                    $tocWrapper.addClass('toc-fixed');
	                    $homeLink.addClass('home-link-hide');
	                    $backTop.addClass('back-top-show');
	                    $sidebarMenu.addClass('header-sidebar-menu-black');
	                } else if (crossingState == -1) {
	                    $tocWrapper.removeClass('toc-fixed');
	                    $homeLink.removeClass('home-link-hide');
	                    $banner.removeClass('banner-show');
	                    $backTop.removeClass('back-top-show');
	                    $sidebarMenu.removeClass('header-sidebar-menu-black');
	                }
	                // 上下滑动一定距离显示/隐藏header
	                // 如果不是post-page 以下忽略
	                if (isPostPage) {
	                    var upDownState = isScrollingUpOrDown(scrollTop);
	                    if (upDownState == 1) {
	                        $banner.removeClass('banner-show');
	                    } else if (upDownState == -1 && !isHigherThanIntro) {
	                        $banner.addClass('banner-show');
	                    }
	                }
	                previousHeight = $(that).scrollTop();
	                ticking = false;
	            });
	            ticking = true;
	        }
	    }

	    $(document).on('scroll', function () {
	        scrollHandler(this);
	    });

	    // 返回顶部
	    function backTop(event) {
	        event.preventDefault();
	        var topTimer = setInterval(function () {
	            var currTop = $(document).scrollTop();
	            window.scrollTo(0, Math.max(Math.floor(currTop * 0.8)));
	            if (currTop === 0) {
	                clearInterval(topTimer);
	            }
	        }, 20);
	    }
	    [$postBanner, $backTop].forEach(function (ele) {
	        ele.on('click', backTop);
	    });
	};

	exports.toggleHeader = toggleHeader;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var initMobile = function initMobile() {
	    if (window.matchMedia) {
	        var mql = window.matchMedia('(max-width: 900px)');
	        mql.addListener(mediaChangeHandler);
	        mediaChangeHandler(mql);
	    } else {
	        window.addListener('resize', function () {
	            var innerWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	            mediaChangeHandler(innerWidth > 900 ? {
	                matches: false
	            } : {
	                matches: true
	            });
	        }, false);
	    }

	    function mediaChangeHandler(mql) {
	        if (mql.matches) {
	            console.log('mobile');
	            // TODO: why
	            document.body.addEventListener('touchstart', function () {});
	        } else {
	            console.log('desktop');
	        }
	    }
	};

	exports.initMobile = initMobile;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var sidebarInit = function sidebarInit() {
	    var $sidebar = $('.sidebar:first'),
	        $wrapper = $('.wrapper:first'),
	        $headerMenu = $('.header-sidebar-menu:first'),
	        $sidebarContent = $sidebar.find('.sidebar-content:first'),
	        $archiveLink = $sidebar.find('.sidebar-archive-link:first'),
	        $tagsLink = $sidebar.find('.sidebar-tags-link:first'),
	        $tocWrapper = $('.toc-wrapper:first'),
	        $header = $('.header:first'),
	        $sidebarHeader = $sidebar.find('.sidebar-header:first');

	    // 点击headerMenu出现sidebar
	    $headerMenu.on('click', function (eve) {
	        showSidebar(eve);
	    });

	    function showSidebar(eve) {
	        $sidebar.addClass('sidebar-show');
	        $wrapper.addClass('wrapper-show-sidebar');
	        $header.addClass('header-slide');
	        $tocWrapper.addClass('toc-slide');
	        eve.stopPropagation();
	    }

	    // 阻止在sidebar中单击收回sidebar
	    $sidebar.on('click', function (eve) {
	        eve.stopPropagation();
	    });

	    // 单击body收回sidebar
	    $wrapper.on('click', function (eve) {
	        if ($sidebar.hasClass('sidebar-show')) {
	            eve.preventDefault();
	            $sidebar.removeClass('sidebar-show');
	            $header.removeClass('header-slide');
	            $wrapper.removeClass('wrapper-show-sidebar');
	            $tocWrapper.removeClass('toc-slide');
	        }
	    });

	    // 切换tags和archive
	    $archiveLink.on('click', function () {
	        $sidebarContent.addClass('sidebar-content-show-archive').removeClass('sidebar-content-show-tags sidebar-show-immediately');
	        $sidebarHeader.addClass('sidebar-header-show-archive').removeClass('sidebar-header-show-tags sidebar-show-immediately');
	    });
	    $tagsLink.on('click', function () {
	        $sidebarContent.addClass('sidebar-content-show-tags').removeClass('sidebar-content-show-archive sidebar-show-immediately');
	        $sidebarHeader.addClass('sidebar-header-show-tags').removeClass('sidebar-header-show-archive sidebar-show-immediately');
	    });

	    // 阻止sidebarContent在滚动到顶部或底部时继续滚动
	    $sidebar.on('mousewheel', function (eve) {
	        var target = eve.target,
	            $sidebarTagList = $sidebar.find('.sidebar-tag-list:first'),
	            $sidebararchive = $sidebar.find('.sidebar-archive:first');

	        if ($.contains($sidebarTagList[0], target) || $sidebarTagList === target) {
	            stopSidebarEdgeScroll.call($sidebarTagList[0], eve);
	        } else if ($.contains($sidebararchive[0], target) || $sidebararchive === target) {
	            stopSidebarEdgeScroll.call($sidebararchive[0], eve);
	        } else {
	            eve.preventDefault();
	        }
	    });

	    // 阻止滚轮在sidebar滚动越界
	    function stopSidebarEdgeScroll(eve) {
	        if (this.scrollHeight == this.clientHeight) {
	            window.event.preventDefault();
	        } else if (this.scrollTop <= 0) {
	            if (eve.originalEvent.wheelDelta > 0) {
	                window.event.preventDefault();
	            }
	        } else if (this.scrollTop >= this.scrollHeight - this.clientHeight) {
	            if (eve.originalEvent.wheelDelta < 0) {
	                window.event.preventDefault();
	            }
	        }
	    }

	    // 点击meta的tag弹出slider
	    function popSidebar() {
	        var popFromArchive = false;
	        // 弹出sidebar
	        // let event = document.createEvent('MouseEvents');
	        // event.initMouseEvent('click', false, true);
	        var event = new MouseEvent('click', {
	            bubbles: true,
	            cancelable: true
	        });
	        if ($sidebarHeader.hasClass('sidebar-header-show-archive') && !$sidebar.hasClass('sidebar-show')) {
	            popFromArchive = true;
	        } else {
	            popFromArchive = false;
	        }
	        // 直接滑动到tags
	        $headerMenu[0].dispatchEvent(event);
	        $tagsLink[0].dispatchEvent(event);
	        if (popFromArchive) {
	            $sidebarHeader.addClass('sidebar-show-immediately');
	            $sidebarContent.addClass('sidebar-show-immediately');
	        }
	    }

	    // 显示tag对应的列表
	    var sidebarTagsName = $('.sidebar-tags-name:first')[0];

	    function clickTag(tagName) {
	        // let event = document.createEvent('MouseEvents');
	        // event.initMouseEvent('click', false, true);
	        var event = new MouseEvent('click', {
	            bubbles: true,
	            cancelable: true
	        });
	        $headerMenu[0].dispatchEvent(event);
	        sidebarTagsName.currTagName = tagName;
	        sidebarTagsName.dispatchEvent(event);
	    }

	    var $postTags = $('.post-tag');
	    $postTags.on('click', function (eve) {
	        popSidebar();
	        var tagName = eve.target.dataset.href;
	        clickTag(tagName);
	        eve.stopPropagation();
	    });
	};

	exports.sidebarInit = sidebarInit;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.initTag = undefined;

	var _util = __webpack_require__(6);

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

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var archerUtil = {
	    backTop: function backTop() {
	        var topTimer = setInterval(function () {
	            var currTop = document.body.scrollTop;
	            document.body.scrollTop -= Math.max(Math.ceil(currTop / 9) + 2);
	            if (currTop === 0) {
	                clearInterval(topTimer);
	            }
	        }, 20);
	    },

	    getScrollTop: function getScrollTop() {
	        return document.documentElement.scrollTop || document.body.scrollTop;
	    },

	    // 获取元素在页面上相对左上角的位置
	    getAbsPosition: function getAbsPosition(e) {
	        var x = e.offsetLeft,
	            y = e.offsetTop;
	        while (e = e.offsetParent) {
	            x += e.offsetLeft;
	            y += e.offsetTop;
	        }
	        return {
	            'x': x,
	            'y': y
	        };
	    },
	    dateFormater: function dateFormater(date, fmt) {
	        var o = {
	            'M+': date.getMonth() + 1, //月份 
	            'd+': date.getDate(), //日 
	            'h+': date.getHours(), //小时 
	            'm+': date.getMinutes(), //分 
	            's+': date.getSeconds(), //秒 
	            'q+': Math.floor((date.getMonth() + 3) / 3), //季度 
	            'S': date.getMilliseconds() //毫秒 
	        };
	        if (/(y+)/.test(fmt)) {
	            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	        }
	        for (var k in o) {
	            if (new RegExp('(' + k + ')').test(fmt)) {
	                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
	            }
	        }
	        return fmt;
	    },
	    toggler: function toggler(target, eventName, btn, addClassName, removeClassName, optEvent) {
	        if (!(target && typeof window !== 'undefined' && (target === window || target.nodeType))) {
	            return;
	        }
	        btn.addEventListener(eventName, function (eve) {
	            if (addClassName) {
	                var classNameArr = addClassName.split(/[, ]/);
	                var length = classNameArr.length;
	                while (length--) {
	                    target.classList.add(classNameArr[length]);
	                }
	            }
	            if (removeClassName) {
	                var _classNameArr = removeClassName.split(/[, ]/);
	                var _length = _classNameArr.length;
	                while (_length--) {
	                    target.classList.remove(_classNameArr[_length]);
	                }
	            }
	            if (optEvent) {
	                optEvent(eve);
	            }
	        });
	    }

	};

	exports.archerUtil = archerUtil;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _browser = __webpack_require__(8);

	var _browser2 = _interopRequireDefault(_browser);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Preview = {
	    initBigImg: function initBigImg() {
	        if (true) {
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

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	'use strict';

	var browser = {
	    versions: function () {
	        var u = window.navigator.userAgent;
	        return {
	            trident: u.indexOf('Trident') > -1, //IE内核
	            presto: u.indexOf('Presto') > -1, //opera内核
	            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
	            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
	            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
	            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
	            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
	            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者安卓QQ浏览器
	            iPad: u.indexOf('iPad') > -1, //是否为iPad
	            webApp: u.indexOf('Safari') == -1, //是否为web应用程序，没有头部与底部
	            weixin: u.indexOf('MicroMessenger') == -1 //是否为微信浏览器
	        };
	    }()
	};

	module.exports = browser;

/***/ })
/******/ ]);