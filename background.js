// chrome.webRequest.onBeforeRequest.addListener(function (res){console.log("onBeforeRequest", res)}, {urls: ["*://*.zhihu.com/*"]}, ["requestBody"]);
// chrome.webRequest.onBeforeSendHeaders.addListener(function (res){console.log("onBeforeSendHeaders", res)}, {urls: ["*://*.zhihu.com/*"]}, ["requestHeaders"]);
// chrome.webRequest.onSendHeaders.addListener(function (res){console.log("onSendHeaders", res)}, {urls: ["*://*.zhihu.com/*"]}, ["requestHeaders"]);
// chrome.webRequest.onHeadersReceived.addListener(function (res){console.log("onHeadersReceived", res)}, {urls: ["*://*.zhihu.com/*"]}, ["responseHeaders"]);
// chrome.webRequest.onResponseStarted.addListener(function (res){console.log("onResponseStarted", res)}, {urls: ["*://*.zhihu.com/*"]}, ["responseHeaders"]);
// chrome.webRequest.onBeforeRedirect.addListener(function (res){console.log("onBeforeRedirect", res)}, {urls: ["*://*.zhihu.com/*"]}, ["responseHeaders"]);
// chrome.webRequest.onCompleted.addListener(function (res){console.log("onCompleted", res)}, {urls: ["*://*.zhihu.com/*"]}, ["responseHeaders"]);
// chrome.webRequest.onErrorOccurred.addListener(function (res){console.log("onErrorOccurred", res)}, {urls: ["*://*.zhihu.com/*"]});



chrome.webRequest.onCompleted.addListener(function (res){console.log("onCompleted", res)}, {urls: ["*://www.zhihu.com/r/answers/*/comments"]});


console.log(123)