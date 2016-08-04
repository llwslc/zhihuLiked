var myUrl = $('.zu-top-nav-userinfo').attr('href');

// 给每个回答下的评论按钮添加一个点击事件(base代码)
var addCommentClick = function() {

    var commentClick = function() {
        console.log("click comment")
    }

    var init = function() {
        var commentBtns = $('[name=\'addcomment\']')

        for (var i = 0; i < commentBtns.length; i++) {
            commentBtns[i].onclick = commentClick
        };
    }

    var feedListInsert = function() {
        var feedList = $('.zh-general-list')//feed_list
        //监听插入
        feedList.on('DOMNodeInserted', function(e) {
            var self = $(e.target);
             if (self.hasClass('feed-item')) {
                var commentBtns = self.find('[name=\'addcomment\']')
                if (commentBtns.length != 0) {
                    commentBtns[0].onclick = commentClick
                };
            };
        });
    }

    init()
    feedListInsert()
}

var likeStr = '仰祈圣鉴';
var unlikeStr = '朕知道了';

// 点击点赞按钮
var commentLikedPut = function(e) {
    var self = $(e.target);
    var commentsId = self.attr('commentsId');
    var commentItemId = self.attr('commentItemId');
    var liked = self.attr('liked');
    var type = (liked === 'true') ? 'DELETE' : 'PUT';
    var _xsrf = $('input[name=_xsrf]').val();
    $.ajax({
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'X-Xsrftoken': _xsrf
        },
        url: `https://www.zhihu.com/r/answers/${commentsId}/comments/${commentItemId}/liked`,
        type: type,
        data: `_xsrf=${_xsrf}`,
        complete: function(response) {
            if (response.status == 204) {
                self[0].innerHTML = (liked === 'true') ? likeStr : unlikeStr;
                self.attr('liked', (liked === 'true') ? false : true);
            } else {
                console.log('点赞失败:', response.status)
            }
        }
    });
}

// 推荐后添加点赞按钮
var commentLikedReappear = function(e, commentsId, commentItemId, liked) {
    var self = $(e);
    var featuredBut = self.find('.zg-icon.zg-icon-comment-like').parent();
    var likedBut = document.createElement('button');
    $(likedBut).addClass(featuredBut.attr('class'));
    var likedIcon = document.createElement('i');
    $(likedIcon).addClass('zg-icon zg-icon-comment-like');
    var likedSpan = document.createElement('span');
    likedSpan.innerHTML = liked ? unlikeStr : likeStr;
    likedSpan.onclick = commentLikedPut;
    $(likedSpan).attr('commentsId', commentsId);
    $(likedSpan).attr('commentItemId', commentItemId);
    $(likedSpan).attr('liked', liked);
    likedBut.appendChild(likedIcon);
    likedBut.appendChild(likedSpan);

    featuredBut.after(likedBut);
}

// 推荐翻页
var commentFeaturedFlip = function(e) {
    var self = $(e.target);
    var pageEles = self.parent().children();
    var commentsId = 0;
    var curPage = 1;

    if (self.parent().prev().find('[liked]').length !== 0) {
        return;
    }

    if (pageEles[pageEles.length - 1].innerHTML == '下一页') {
        var parents = self.parents();
        for (var i = 0; i < parents.length; i++) {
            if ($(parents[i]).hasClass('zm-item-answer-owner')) {
                commentsId = $(parents[i]).attr('data-aid');
            }
        };

        var pages = self.parent().find("span[class^='_Pager_unclickable_']");
        for (var i = 0; i < pages.length; i++) {
            var pageNum = Number(pages[i].innerHTML);
            if (!isNaN(pageNum)) {
                curPage = pageNum;
            }
        };

        getCommentListReq(commentsId, curPage, self.parent().parent());
    }
}

// 检测到有推荐
var commentFeaturedFound = function(e) {
    var self = e;
    var parents = self.parents();
    var prev = self.prev();
    var commentsId = 0;
    var curPage = 1;
    for (var i = 0; i < parents.length; i++) {
        if ($(parents[i]).hasClass('zm-item-answer-owner')) {
            commentsId = $(parents[i]).attr('data-aid');
        }
    };

    if (new RegExp('^_Pager_root_').test(prev.attr('class'))) {
        prev.on('DOMNodeInserted', commentFeaturedFlip)
        var pages = prev.find("span[class^='_Pager_unclickable_']");
        for (var i = 0; i < pages.length; i++) {
            var pageNum = Number(pages[i].innerHTML);
            if (!isNaN(pageNum)) {
                curPage = pageNum;
            }
        };
    }

    getCommentListReq(commentsId, curPage, self.parent());
}

// 获取评论列表
var getCommentListReq = function(commentsId, curPage, commentBoxRoot) {
    var self = commentBoxRoot.find('._CommentItem_root_PQNS');
    $.get(`https://www.zhihu.com/r/answers/${commentsId}/comments?page=${curPage}`, function(response){
        for (var i = 0; i < response.data.length; i++) {
            if (!response.data[i].author.isSelf) {
                var liked = response.data[i].liked;
                for (var j = 0; j < self.length; j++) {
                    var commentItemId = response.data[i].id;
                    if (commentItemId == $(self[j]).attr('data-id')) {
                        commentLikedReappear(self[j], commentsId, commentItemId, liked);
                        break;
                    }
                };
            }
        };
    });
}

// 评论赞修改
var commentLikedModifyFunc = function(e) {
    var text = e.innerHTML;
    if (text == '赞') {
        e.innerHTML = likeStr;
    } else if (text == '取消赞') {
        e.innerHTML = unlikeStr;
    } else {
        // 推荐
    }
}

// 创建评论点赞的观察者对象(废弃)
// var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

// var likedObserver = new MutationObserver(function(mutations) {
//     commentLikedModifyFunc(mutations[0].target)
// });

// likedObserver.observe(likeSpan[i], {childList: true});

// 评论列表插入
var commentListInsertFunc = function(e) {
    var self = $(e.target);
    if ((self.hasClass('_CommentBox_list_10_K')) || (self.hasClass('_CommentItem_root_PQNS'))) {
        // 评论列表打开 或 翻页
        var likeSpan = self.find('.zg-icon.zg-icon-comment-like').next();
        for (var i = 0; i < likeSpan.length; i++) {
            commentLikedModifyFunc(likeSpan[i])
        };
    } else if (self.is('span')) {
        // 成功点赞
        commentLikedModifyFunc(self[0])
    } else if (new RegExp('^_CommentForm_root_').test(self.attr('class'))) {
        // 评论框
        var likeSpan = self.parent().find('.zg-icon.zg-icon-comment-like').next();
        var likeSpanText = likeSpan[0].innerHTML;
        if (likeSpanText == '推荐' || likeSpanText == '取消推荐') {
            commentFeaturedFound(self);
        }
    } else {
        // null
    }
}

// 评论面板展开
var commentPanelInsertFunc = function(e) {
    var self = $(e.target);
    if (self.hasClass('comment-app-holder')) {
        self.on('DOMNodeInserted', commentListInsertFunc)
    }
}

// 回答监听设置
var answerInsertFunc = function(e) {
    var commentBtns = e.find('[name=\'addcomment\']')
    if (commentBtns.length != 0) {
        var commentPanel = e.find('.zm-item-meta.answer-actions.clearfix.js-contentActions')
        $(commentPanel[0]).on('DOMNodeInserted', commentPanelInsertFunc)
    }
}

// 首页
var homeInit = function() {
    // 现有监听
    var feedMetas = $('.feed-item')
    for (var i = 0; i < feedMetas.length; i++) {
        answerInsertFunc($(feedMetas[i]))
    };
    // 更新监听
    var feedList = $('.zh-general-list')
    feedList.on('DOMNodeInserted', function(e) {
        var self = $(e.target);
         if (self.hasClass('feed-item')) {
            answerInsertFunc(self)
        };
    });
}

// 回答
var answerInit = function () {
    // 现有监听
    // 同首页现有监听

    // 更新监听
    // 同首页更新监听
}

// 问题
var questionInit = function() {
    // 现有监听
    // 同首页现有监听

    // 更新监听
    var answerList = $('#zh-question-answer-wrap')
    answerList.on('DOMNodeInserted', function(e) {
        var self = $(e.target);
         if (self.hasClass('zm-item-answer')) {
            answerInsertFunc(self)
        };
    });
}

// 个人主页
var peopleInit = function () {
    // 现有监听
    var mAnswers = $('.zm-item-answer')
    for (var i = 0; i < mAnswers.length; i++) {
        answerInsertFunc($(mAnswers[i]))
    };
}

// 收藏
var collectionInit = function () {
    // 现有监听 OK
    // 更新监听 OK

}

// 发现
var exploreInit = function () {
    // 现有监听 OK
    // 更新监听 FAIL
}

// 搜索结果
var searchInit = function () {
    // 现有监听 FAIL
    // 更新监听 FAIL
}

// 话题
var topicInit = function () {
    // 现有监听 FAIL
    // 更新监听 FAIL
}

// 圆桌
var roundtableInit = function () {
    // 现有监听 FAIL
    // 更新监听 FAIL
}

homeInit()
answerInit()
questionInit()
peopleInit()
collectionInit()
exploreInit()
searchInit()
topicInit()
roundtableInit()





// Request URL:https://www.zhihu.com/r/answers/39318296/comments
// Request Method:POST
// Status Code:201 Created
// Remote Address:125.39.6.139:443
// Response Headers
// view source
// Cache-Control:no-store
// Connection:keep-alive
// Content-Length:601
// Content-Security-Policy:default-src *; img-src * data:; frame-src 'self' *.zhihu.com getpocket.com note.youdao.com; script-src 'self' *.zhihu.com *.google-analytics.com zhstatic.zhihu.com res.wx.qq.com 'unsafe-eval'; style-src 'self' *.zhihu.com 'unsafe-inline'
// Content-Type:application/json; charset=UTF-8
// Date:Thu, 07 Jul 2016 09:57:33 GMT
// Pragma:no-cache
// Server:nnws/1.7.3.7
// Set-Cookie:_xsrf=; Domain=zhihu.com; expires=Wed, 08 Jul 2015 09:57:34 GMT; Path=/
// Vary:Accept-Encoding
// X-Frame-Options:DENY
// X-Req-ID:8822776577E278D
// X-Za-Response-Id:eb51cef06ad94c9586abd7888fa0b31f
// Request Headers
// view source
// Accept:application/json, text/plain, */*
// Accept-Encoding:gzip, deflate, br
// Accept-Language:zh-CN,zh;q=0.8,en;q=0.6
// Connection:keep-alive
// Content-Length:18
// Content-Type:application/json
// Cookie:_za=2094619c-809c-4597-9f53-2cc64b833dc6; udid="AJBAFJgvlAmPTraNWmH02QEYuF4zpHEa4MQ=|1457504460"; _zap=52f4d43b-f979-427a-a45d-e80a7f6945a4; d_c0="AADAE6r7oQmPThbg4PbSqo9hUIvKoF5a5CY=|1460948102"; l_cap_id="YjA1ODdkZTBlN2VkNDk0NzhmYzQyNWU2NTlhZjA1ZWU=|1465977394|a9b7914a368ce77c20cd1a4b17ae0a8e4dfa7dfe"; cap_id="YTA2NmM4NzI3NWVkNDk2Yjk3OWUzOTU5NGVlNTE0MDU=|1465977394|231cdcd7ac58814707365ece7ac6a1043888decc"; login="YmMzMTUzNGQzYjNmNDU1ODhiYzNhZmExNzBiYTE2NDc=|1465977477|6088ea4b065a6c6201268deb222bb8df7baf2e98"; z_c0=Mi4wQUFCQVY1QVlBQUFBQU1BVHF2dWhDUmNBQUFCaEFsVk5oWmVJVndDRkdhd3dGbkVtMU9aRTJyUFFDdHdSRWF3cEJn|1465977477|c65ed5e1a82ee7347100986c5abca16cab195841; n_c=1; _ga=GA1.2.2072464264.1448342722; _xsrf=88f84f77e20783f3c7ed6c504143e03e; q_c1=e9d377662ea245bdbf72313b22988bc3|1466649855000|1447754407000; s-q=react; s-i=8; sid=etjpvodf; s-t=autocomplete; __utmt=1; a_t="2.0AABAV5AYAAAXAAAAJLSlVwAAQFeQGAAAAADAE6r7oQkXAAAAYQJVTYWXiFcAhRmsMBZxJtTmRNqz0ArcERGsKQarrZG9m_lS6JJgC4IkIfv2ftMHMg=="; __utma=51854390.2072464264.1448342722.1467880237.1467884062.2; __utmb=51854390.31.9.1467885419942; __utmc=51854390; __utmz=51854390.1467880237.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmv=51854390.100-1|2=registration_date=20110727=1^3=entry_date=20110727=1
// Host:www.zhihu.com
// Origin:https://www.zhihu.com
// Referer:https://www.zhihu.com/question/20970090/answer/109618623
// User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36
// X-Requested-With:XMLHttpRequest
// X-Xsrftoken:88f84f77e20783f3c7ed6c504143e03e
// Request Payload
// view source
// {content: "test"}


