define(function (require, exports, module) {
    'use strict';
    var $ = require('../lib/dom/1.0.x/');
    var bannerHideTimer = null,
        bannerShowTimer = null,
        luckyPopScrollTimer = null;
    var DomTestObj = {
        init: function(){
            testBanner();
            testMoveLeft();
            testMoveLeft2();
        }
    };
    function testBanner(){
        var $bannerWrap = $('#bannerWrap'),
            $bannerT = null,
            $bannerB = null;
        var domStr = '<div class="banner_content"><div class="banner_top">top</div><div class="banner_bottom">bottom</div></div>';
        $bannerWrap.append(domStr);
        $bannerT = $bannerWrap.find('.banner_top');
        $bannerB = $bannerWrap.find('.banner_bottom');
        $bannerWrap.css({'opacity': 1, 'top':'0px'});
        $bannerT.animate({
            'width': '150px'
        }, {duration: 300});
        $bannerB.animate({
            'width': '300px'
        }, {
            duration: 300,
            callback: function(){
                clearTimeout(bannerHideTimer);
                bannerHideTimer = setTimeout(function(){
                    $bannerWrap.animate({
                        'opacity': '0'
                    },{
                        duration: 500,
                        callback: function(){
                            $bannerWrap.find('.banner_content').remove();
                            clearTimeout(bannerShowTimer);
                            bannerShowTimer = setTimeout(function(){
                                testBanner();
                            }, 1000);
                        }
                    });
                }, 1000);
            }
        });
    }
    function testMoveLeft(){
        var $moveLeftWrap = $('#moveLeftWrap');
        $moveLeftWrap.animate({
            'left': '350px'
        }, {
            duration: 15000,
            callback: function(){
                $moveLeftWrap.css({'left': '0px'});
                testMoveLeft();
            }
        });
    }
    function testMoveLeft2(){
        var $moveLeftWrap = $('#moveLeftWrap2'),
            scrollTime = 0;

        scrollTime = 350/15;
        startScroll({
            offset: 350,
            scrollTime: scrollTime,
            targetDom: $moveLeftWrap,
            succCallback: function(){
                $moveLeftWrap.css({'left': '0px'});
                testMoveLeft2();
            }
        });
    }
    // 手动实现滚动...(解决动画库 实现滚动图片抖动bug)
    // opt.offset 滚动距离（必填项）
    // opt.scrollTime 滚动速度（必填项）
    // opt.targetDom 滚动节点（必填项）
    // opt.succCallback 滚动完成回调函数
    function startScroll(opt) {
        var left = 0;
        var scrollStep = 1,
            offset = opt.offset,
            scrollTime = opt.scrollTime,
            targetDom = opt.targetDom,
            succCallback = opt.succCallback;
        //防止重复添加定时器
        clearTimeout(luckyPopScrollTimer);
        luckyPopScrollTimer = window.setTimeout(function() {
            left = parseInt(targetDom.css('left'), 10);
            if (Math.abs(left) >= offset) {
                if (succCallback) {
                    succCallback();
                }
                return false;
            }
            left += scrollStep;
            targetDom.css('left', left);
            startScroll(opt);
        }, scrollTime);
    }

    DomTestObj.init();
});
