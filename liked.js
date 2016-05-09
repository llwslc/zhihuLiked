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

        getCommentListReq(commentsId, curPage);
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

    getCommentListReq(commentsId, curPage);
}

// 获取评论列表
var getCommentListReq = function(commentsId, curPage) {
    $.get(`https://www.zhihu.com/r/answers/${commentsId}/comments?page=${curPage}`, function(resp){
        for (var i = 0; i < resp.data.length; i++) {
            if (!resp.data[i].author.isSelf) {
                var liked = resp.data[i].liked;
                console.log(resp.data[i].id)

                //<div class="_CommentItem_root_PQNS" tabindex="-1" aria-label="杨祉杰的评论" data-id="125602397" data-reactid=".0.1.$125602397"><a data-tip="p$t$yang-zhi-jie-95" href="http://www.zhihu.com/people/yang-zhi-jie-95" target="_blank" tabindex="-1" class="_CommentItem_avatarLink_3V51 hidden-phone" data-reactid=".0.1.$125602397.0"><img tabindex="-1" class="Avatar Avatar-s" src="https://pic2.zhimg.com/24c68de39e955951c271f18ab0bdd759_s.jpg" srcset="https://pic2.zhimg.com/24c68de39e955951c271f18ab0bdd759_xs.jpg 2x" data-reactid=".0.1.$125602397.0.0"></a><div class="_CommentItem_body_3qwB" data-reactid=".0.1.$125602397.1"><div class="_CommentItem_header_2JGh" data-reactid=".0.1.$125602397.1.0"><a data-tip="p$t$yang-zhi-jie-95" href="http://www.zhihu.com/people/yang-zhi-jie-95" target="_blank" data-reactid=".0.1.$125602397.1.0.0">杨祉杰</a></div><div class="_CommentItem_content_CYqW" data-reactid=".0.1.$125602397.1.1">从上知乎起就没觉得奶爸哪个答案有料……</div><div class="_CommentItem_footer_46v8 clearfix" data-reactid=".0.1.$125602397.1.2"><span class="_CommentItem_likes_2hey" data-tip="s$r$25 人觉得这个很赞" data-reactid=".0.1.$125602397.1.2.0"><span data-reactid=".0.1.$125602397.1.2.0.0">25</span><span data-reactid=".0.1.$125602397.1.2.0.1"> 赞</span></span><time title="2016-03-21 15:00:54" data-reactid=".0.1.$125602397.1.2.1">2 月前</time><button class="_CommentItem_action_Hk0w _CommentBox_textButton_3t9_" data-reactid=".0.1.$125602397.1.2.2"><i class="zg-icon zg-icon-comment-del" data-reactid=".0.1.$125602397.1.2.2.0"></i><span data-reactid=".0.1.$125602397.1.2.2.1">删除</span></button><button class="_CommentItem_action_Hk0w _CommentBox_textButton_3t9_" data-reactid=".0.1.$125602397.1.2.3"><i class="zg-icon zg-icon-comment-reply" data-reactid=".0.1.$125602397.1.2.3.0"></i><span data-reactid=".0.1.$125602397.1.2.3.1">回复</span></button><button class="_CommentItem_action_Hk0w _CommentBox_textButton_3t9_" data-reactid=".0.1.$125602397.1.2.4"><i class="zg-icon zg-icon-comment-like" data-reactid=".0.1.$125602397.1.2.4.0"></i><span data-reactid=".0.1.$125602397.1.2.4.1">推荐</span></button><button label="举报" icon="zg-icon zg-icon-comment-report" class="_CommentItem_action_Hk0w _CommentBox_textButton_3t9_" data-reactid=".0.1.$125602397.1.2.5:$report"><i class="zg-icon zg-icon-comment-report" data-reactid=".0.1.$125602397.1.2.5:$report.0"></i><span data-reactid=".0.1.$125602397.1.2.5:$report.1">举报</span></button></div></div></div>
            }
        };
    });
}

// 评论赞修改
var commentLikedModifyFunc = function(e) {
    var text = e.innerHTML;
    if (text == '赞') {
        e.innerHTML = '仰祈圣鉴'
    } else if (text == '取消赞') {
        e.innerHTML = '朕知道了'
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
// GET https://www.zhihu.com/r/answers/33112390/comments?bycomment=128671011

//
// <a href="#" name="addcomment" class=" meta-item toggle-comment">
// <i class="z-icon-comment"></i>添加评论</a>

// <div class="comment-app-holder" style="display: none;">