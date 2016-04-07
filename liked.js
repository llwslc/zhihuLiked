var myUrl = $('.zu-top-nav-userinfo').attr('href');


var addCommentClick = function() {
    // 给每个回答下的评论按钮添加一个点击事件

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
    } else {
        e.innerHTML = "朕知道了"
    }
}

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

// 创建评论点赞的观察者对象
var likedObserver = new MutationObserver(function(mutations) {
    commentLikedModifyFunc(mutations[0].target)
});

// 评论列表
var commentListInsertFunc = function(e) {
    var self = $(e.target)
    if (self.hasClass('_CommentBox_list_10_K')) {
        var likeSpan = self.find('.zg-icon.zg-icon-comment-like').next()
        for (var i = 0; i < likeSpan.length; i++) {
            commentLikedModifyFunc(likeSpan[i])
            likedObserver.observe(likeSpan[i], {childList: true});
        };
    }
}

// 评论面板展开
var commentPanelInsertFunc = function(e) {
    var self = $(e.target);
    if (self.hasClass('comment-app-holder')) {
        self.on('DOMNodeInserted', commentListInsertFunc)
    }
}

// 初始化
var init = function() {
    var feedMetas = $('.feed-meta')
    for (var i = 0; i < feedMetas.length; i++) {
        var commentBtns = $(feedMetas[i]).find('[name=\'addcomment\']')
        if (commentBtns.length != 0) {
            var commentPanel = $(feedMetas[i]).find('.zm-item-meta.zm-item-comment-el.answer-actions.clearfix')
            $(commentPanel[0]).on('DOMNodeInserted', commentPanelInsertFunc)
        };
    };
}

init()

//<button class="_CommentItem_action_Hk0w _CommentBox_textButton_3t9_" data-reactid=".0.1.$56279125.1.2.4"><i class="zg-icon zg-icon-comment-like" data-reactid=".0.1.$56279125.1.2.4.0"></i><span data-reactid=".0.1.$56279125.1.2.4.1">赞</span></button>

// vendor.ff76fbae.js:5 PUT https://www.zhihu.com/r/answers/33064505/comments/128518691/liked

//
// <a href="#" name="addcomment" class=" meta-item toggle-comment">
// <i class="z-icon-comment"></i>添加评论</a>

// <div class="comment-app-holder" style="display: none;">