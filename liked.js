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

// 评论赞修改
var commentLikedModifyFunc = function(e) {
    var text = e.innerHTML
    if (text == '赞') {
        e.innerHTML = "仰祈圣鉴"
    } else if (text == '取消赞') {
        e.innerHTML = "朕知道了"
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
    var self = $(e.target)
    if ((self.hasClass('_CommentBox_list_10_K')) || (self.hasClass('_CommentItem_root_PQNS'))) {
        // 评论列表打开 或 翻页
        var likeSpan = self.find('.zg-icon.zg-icon-comment-like').next()
        for (var i = 0; i < likeSpan.length; i++) {
            commentLikedModifyFunc(likeSpan[i])
        };
    } else if (self.is('span')) {
        // 成功点赞
        commentLikedModifyFunc(self[0])
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
        var commentPanel = e.find('.zm-item-meta.zm-item-comment-el.answer-actions.clearfix')
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
    var tAnswer = $('.zh-question-answer-wrapper')
    answerInsertFunc(tAnswer)

    // 展开监听
    // 同首页现有监听
}

// 问题
var questionInit = function() {
    // 现有监听
    // 同下更新监听

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


        // $.post(href+'/block',$.param({
        //     action:'add'
        //   , _xsrf:$('input[name=_xsrf]').val()
        // }),function(r){
        //     var href=this.url.replace('/block','')
        //       , userID=href.split('/').pop()
        //       , who=','+userID+','
        //       , blocking=iZhihu.QuickBlock.Blocking
        //     ;

        //     if(0==--blocking.Count)$cartDIV.removeClass('pending');

        //     if(blocking.Users.indexOf(who) < 0)
        //         return; // No this user in pending

        //     blocking.Users = blocking.Users.replace(who,',');
        //     $('#izh_blockCart .user2B[href="'+href+'"]').find('.del')[0].click();
        //     $('a[href$="'+href+'"]').css('text-decoration','line-through');
        // }).always(function(data, textStatus, jqXHR){
        //     iZhihu.QuickBlock.doQuickBlock()


//<button class="_CommentItem_action_Hk0w _CommentBox_textButton_3t9_" data-reactid=".0.1.$56279125.1.2.4"><i class="zg-icon zg-icon-comment-like" data-reactid=".0.1.$56279125.1.2.4.0"></i><span data-reactid=".0.1.$56279125.1.2.4.1">赞</span></button>
//<button class="_CommentItem_action_Hk0w _CommentBox_textButton_3t9_" data-reactid=".0.1.$125584489.1.2.4"><i class="zg-icon zg-icon-comment-like" data-reactid=".0.1.$125584489.1.2.4.0"></i><span data-reactid=".0.1.$125584489.1.2.4.1">取消推荐</span></button>

// vendor.ff76fbae.js:5 PUT https://www.zhihu.com/r/answers/33064505/comments/128518691/liked
// _xsrf:8cffeff93efecb919ed68cb0a10d2b23

// vendor.ff76fbae.js:5 PUT https://www.zhihu.com/r/answers/32108751/comments/125579367/featured

// GET https://www.zhihu.com/r/answers/28289374/comments
// GET https://www.zhihu.com/r/answers/32623390/comments?page=2

//
// <a href="#" name="addcomment" class=" meta-item toggle-comment">
// <i class="z-icon-comment"></i>添加评论</a>

// <div class="comment-app-holder" style="display: none;">