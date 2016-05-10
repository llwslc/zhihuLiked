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
        url: `https://www.zhihu.com/r/answers/${commentsId}/comments/${commentItemId}/liked`,
        type: type,
        data: `_xsrf=${_xsrf}`,
        complete: function(response) {
            if (response.status == 204) {
                console.log(self)
                console.log(liked)
                console.log((liked === 'true'))
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

