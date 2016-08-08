var myUrl = $('.zu-top-nav-userinfo').attr('href');

// 给每个回答下的评论按钮添加一个点击事件(base代码)
var addCommentClick = function () {

    var commentClick = function () {
        console.log("click comment")
    }

    var init = function () {
        var commentBtns = $('[name=\'addcomment\']')

        for (var i = 0; i < commentBtns.length; i++) {
            commentBtns[i].onclick = commentClick
        };
    }

    var feedListInsert = function () {
        var feedList = $('.zh-general-list')//feed_list
        //监听插入
        feedList.on('DOMNodeInserted', function (e) {
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
var commentLikedPut = function (e) {
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
        complete: function (response) {
            if (response.status == 204) {
                self[0].innerHTML = (liked === 'true') ? likeStr : unlikeStr;
                self.attr('liked', (liked === 'true') ? false : true);
            } else {
                console.log('点赞失败:', response.status)
            }
        }
    });
}

// 点击评论按钮
var commentSubmitPost = function (e) {
    var self = $(e.target);
    var input = self.parent().prev()[0].innerHTML;
    var commentsId = self.attr('commentsId');
    var _xsrf = $('input[name=_xsrf]').val();

    if (!!!input) {
        input = self.parent().prev()[0].value;
    }

    if (!!input) {
        $.ajax({
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'X-Xsrftoken': _xsrf
            },
            url: `https://www.zhihu.com/r/answers/${commentsId}/comments`,
            type: 'POST',
            data: JSON.stringify({content: input}),
            complete: function (response) {
                if (response.status == 201) {conso
                    commentStatus(self);
                } else {
                    commentStatus(self, response.status);
                }
            }
        });
    }
}

// 点击删除评论按钮
var commentDelete = function (e) {

}

// Request URL:https://www.zhihu.com/r/answers/4143105/comments/157090959
// Request Method:DELETE
// Status Code:204 No Content
// Remote Address:125.39.6.139:443
// Response Headers
// view source
// Cache-Control:no-store
// Connection:keep-alive
// Content-Length:0
// Content-Security-Policy:default-src *; img-src * data:; frame-src 'self' *.zhihu.com getpocket.com note.youdao.com; script-src 'self' *.zhihu.com *.google-analytics.com zhstatic.zhihu.com res.wx.qq.com 'unsafe-eval'; style-src 'self' *.zhihu.com 'unsafe-inline'
// Content-Type:text/html; charset=UTF-8
// Date:Mon, 08 Aug 2016 10:44:53 GMT
// Pragma:no-cache
// Server:Qnginx/1.1.1
// Set-Cookie:_xsrf=; Domain=zhihu.com; expires=Sun, 09 Aug 2015 10:44:53 GMT; Path=/
// Set-Cookie:a_t="2.0AABAzI4-AAAXAAAApe_PVwAAQMyOPgAAACDAuPZgWAoXAAAAYQJVTUvuz1cAupSFrfjTPh40-trHLRz6Di5BM7SW0VPy-gOxoFB1KXqtS87lxvMQSQ=="; Domain=zhihu.com; expires=Wed, 07 Sep 2016 10:39:07 GMT; Path=/; secure
// Set-Cookie:z_c0=Mi4wQUFCQXpJNC1BQUFBSU1DNDltQllDaGNBQUFCaEFsVk5TLTdQVndDNmxJV3QtTk0tSGpUNjJzY3RIUG9PTGtFenRB|1470653093|9ec44239f59bf81a02172e9736f3d13b9e054dbb; Domain=zhihu.com; expires=Wed, 07 Sep 2016 10:39:07 GMT; httponly; Path=/
// Vary:Accept-Encoding
// X-Frame-Options:DENY
// X-NWS-LOG-UUID:018d6840-1e79-4faa-a00b-5a01a5816afb
// X-Req-ID:D3DB42B57A862A3
// X-Za-Experiment:default,cmt_v1
// X-Za-Response-Id:f365aeb85fe34e6fa049a106ba546b57
// Request Headers
// view source
// Accept:application/json, text/plain, *
// Accept-Encoding:gzip, deflate, sdch, br
// Accept-Language:zh-CN,zh;q=0.8,en;q=0.6
// Connection:keep-alive
// Cookie:q_c1=ddd08694522b4a42b62d6f949717ddd2|1470509689000|1470509689000; _xsrf=a79a7234a965f6883d8245d9075420a5; d_c0="ACDAuPZgWAqPTsc87GqM7-s1_RTN-dHbSsA=|1470509690"; _zap=bd8d017a-b8ed-498f-880c-6137765a4158; _za=a295f394-fa32-4cf8-9407-f92167585f8b; l_cap_id="N2U3YTg3N2JjNDRmNDQ4OWFhYzBlOGU4OTFmOWZjNGI=|1470652731|3c64c8a1a402abfbfc0c06c0a1966edf3a4b7fc3"; cap_id="NjQ4ZTQ4NzA5NjEwNDA5ZDgwMWQ3MGUyMTliNTQ0NTk=|1470652731|85c12c6f97350733b8ae51236a432a67b5cbc5e1"; login="OGU5ZDM3NjQ4MzJkNGY5ZWE4MzY5MTU3NjkxYWNlZWY=|1470652742|2843cb6e37e3647a57b770270da3e6ef6eda9ed2"; n_c=1; s-q=xx; s-i=7; sid=rs9a5kq8; s-t=autocomplete; __utmt=1; __utma=51854390.1153349369.1470648509.1470648509.1470648509.1; __utmb=51854390.123.9.1470652884286; __utmc=51854390; __utmz=51854390.1470648509.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmv=51854390.100-1|2=registration_date=20141029=1^3=entry_date=20141029=1; a_t="2.0AABAzI4-AAAXAAAAne_PVwAAQMyOPgAAACDAuPZgWAoXAAAAYQJVTUvuz1cAupSFrfjTPh40-trHLRz6Di5BM7QbK7JsxP3YYQLzUvnVhOIHH1I7dQ=="; z_c0=Mi4wQUFCQXpJNC1BQUFBSU1DNDltQllDaGNBQUFCaEFsVk5TLTdQVndDNmxJV3QtTk0tSGpUNjJzY3RIUG9PTGtFenRB|1470653085|af016283d90f94f5d31fd62e4aa131df71382de8
// Host:www.zhihu.com
// Origin:https://www.zhihu.com
// Referer:https://www.zhihu.com/question/22674069/answer/22353897
// User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36
// X-Requested-With:XMLHttpRequest
// X-Xsrftoken:a79a7234a965f6883d8245d9075420a5

// <div class="_CommentItem_root_PQNS" tabindex="-1" aria-label="野小马的评论" data-id="157092607" data-reactid=".1.2.$157092607">
//     <a data-hovercard="p$t$ye-xiao-ma-63" href="http://www.zhihu.com/people/ye-xiao-ma-63" target="_blank" tabindex="-1" class="_CommentItem_avatarLink_3V51 hidden-phone" data-reactid=".1.2.$157092607.0">
//         <img tabindex="-1" class="Avatar Avatar-s" src="https://pic1.zhimg.com/da8e974dc_s.jpg" srcset="https://pic1.zhimg.com/da8e974dc_xs.jpg 2x" data-reactid=".1.2.$157092607.0.0"></a>
//     <div class="_CommentItem_body_3qwB" data-reactid=".1.2.$157092607.1">
//         <div class="_CommentItem_header_2JGh" data-reactid=".1.2.$157092607.1.0">
//             <a data-hovercard="p$t$ye-xiao-ma-63" href="http://www.zhihu.com/people/ye-xiao-ma-63" target="_blank" data-reactid=".1.2.$157092607.1.0.0">野小马</a>
//         </div>
//         <div class="_CommentItem_content_CYqW" data-reactid=".1.2.$157092607.1.1">太可怕了</div>
//         <div class="_CommentItem_footer_46v8 clearfix" data-reactid=".1.2.$157092607.1.2">
//             <span class="_CommentItem_likes_2hey" hidden="" data-tooltip="s$r$0 人觉得这个很赞" data-reactid=".1.2.$157092607.1.2.0">
//                 <span data-reactid=".1.2.$157092607.1.2.0.0">0</span>
//                 <span data-reactid=".1.2.$157092607.1.2.0.1">赞</span>
//             </span>
//             <time title="2016-08-08 18:51:26" data-reactid=".1.2.$157092607.1.2.1">刚刚</time>
//             <button class="_CommentItem_action_Hk0w _CommentBox_textButton_3t9_" data-reactid=".1.2.$157092607.1.2.2"> <i class="zg-icon zg-icon-comment-del" data-reactid=".1.2.$157092607.1.2.2.0"></i>
//                 <span data-reactid=".1.2.$157092607.1.2.2.1">删除</span>
//             </button>
//         </div>
//     </div>
// </div>

// 获取对话标示
var commentIdGet = function (e) {
    var self = e;
    var parents = self.parents();
    var commentsId = 0;
    for (var i = 0; i < parents.length; i++) {
        if ($(parents[i]).hasClass('zm-item-answer-owner') || $(parents[i]).hasClass('zm-item-answer')) {
            commentsId = $(parents[i]).attr('data-aid');
        }
    };

    return commentsId;
}

// 添加评论状态
var commentStatus = function (e, flag) {
    var self = $(e);

    var msg = document.createElement('label');

    if (!!flag) {
        msg.innerHTML = '评论失败: ' + flag;
    } else {
        msg.innerHTML = '评论成功';
    }

    self.after(msg);
}

// 添加评论对话框(突破拉黑)
var commentFormReappear = function (e) {
    var self = $(e);

    var newForm = document.createElement('div');
    var newInput = document.createElement('input');
    var newAction = document.createElement('div');
    var newSubmit = document.createElement('button');
    $(newInput).css('width', '90%');
    $(newSubmit).addClass('zg-btn-blue');
    var commentsId = commentIdGet(self);
    $(newSubmit).attr('commentsId', commentsId);
    newSubmit.innerHTML = '评论';
    newSubmit.onclick = commentSubmitPost;

    newForm.appendChild(newInput);
    newForm.appendChild(newAction);
    newAction.appendChild(newSubmit);

    self.after(newForm);
}

// 添加新评论按钮(突破禁言)
var commentSubmitButtonAdd = function (e) {
    var self = $(e);
    self.attr('hidden', 'true');
    var newSubmitBut = document.createElement('button');
    $(newSubmitBut).addClass('zg-btn-blue');
    var commentsId = commentIdGet(self);
    $(newSubmitBut).attr('commentsId', commentsId);
    newSubmitBut.innerHTML = '评论';
    newSubmitBut.onclick = commentSubmitPost;

    self.next().after(newSubmitBut);
}

// 推荐后添加点赞按钮
var commentLikedReappear = function (e, commentsId, commentItemId, liked) {
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
var commentFeaturedFlip = function (e) {
    var self = $(e.target);
    var pageEles = self.parent().children();
    var commentsId = 0;
    var curPage = 1;

    if (self.parent().prev().find('[liked]').length !== 0) {
        return;
    }

    if (pageEles[pageEles.length - 1].innerHTML == '下一页') {
        commentsId = commentIdGet(self);

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
var commentFeaturedFound = function (e) {
    var self = e;
    var prev = self.prev();
    var commentsId = 0;
    var curPage = 1;

    commentsId = commentIdGet(self);

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
var getCommentListReq = function (commentsId, curPage, commentBoxRoot) {
    var self = commentBoxRoot.find('._CommentItem_root_PQNS');
    $.get(`https://www.zhihu.com/r/answers/${commentsId}/comments?page=${curPage}`, function (response){
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
var commentLikedModifyFunc = function (e) {
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

// var likedObserver = new MutationObserver(function (mutations) {
//     commentLikedModifyFunc(mutations[0].target)
// });

// likedObserver.observe(likeSpan[i], {childList: true});

// 评论列表插入
var commentListInsertFunc = function (e) {
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
        if (likeSpan.length != 0) {
            var likeSpanText = likeSpan[0].innerHTML;
            if (likeSpanText == '推荐' || likeSpanText == '取消推荐') {
                commentFeaturedFound(self);
            }
        }

        if ($(self).find('button[class^="_CommentForm_submitButton_"]')) {
            if(typeof($(self).find('button[class^="_CommentForm_submitButton_"]').attr('hidden')) == 'undefined') {
                commentSubmitButtonAdd($(self).find('button[class^="_CommentForm_submitButton_"]')[0])
            }
        }
    } else if (new RegExp('^_CommentBox_cannotCommentReason_').test(self.attr('class'))) {
        // 不能评论
        commentFormReappear(self);
    } else {
        // null
    }
}

// 评论面板展开
var commentPanelInsertFunc = function (e) {
    var self = $(e.target);
    if (self.hasClass('comment-app-holder')) {
        self.on('DOMNodeInserted', commentListInsertFunc)
    }
}

// 回答监听设置
var answerInsertFunc = function (e) {
    var commentBtns = e.find('[name=\'addcomment\']')
    if (commentBtns.length != 0) {
        var commentPanel = e.find('.zm-item-meta.answer-actions.clearfix.js-contentActions')
        $(commentPanel[0]).on('DOMNodeInserted', commentPanelInsertFunc)
    }
}

// 首页
var homeInit = function () {
    // 现有监听
    var feedMetas = $('.feed-item')
    for (var i = 0; i < feedMetas.length; i++) {
        answerInsertFunc($(feedMetas[i]))
    };
    // 更新监听
    var feedList = $('.zh-general-list')
    feedList.on('DOMNodeInserted', function (e) {
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
var questionInit = function () {
    // 现有监听
    // 同首页现有监听

    // 更新监听
    var answerList = $('#zh-question-answer-wrap')
    answerList.on('DOMNodeInserted', function (e) {
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
// Accept:application/json, text/plain, *
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


