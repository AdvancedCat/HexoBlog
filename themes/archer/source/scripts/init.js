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