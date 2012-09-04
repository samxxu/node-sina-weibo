A simple [node.js](http://nodejs.org) OAuth2 client for Sina Weibo API. It is designed to be a low level SDK to gain flexibility and stability.

Without any wrapper APIs, it's like a mirror to the server side APIs. All you need to do is to read the [Sina Weibo API](http://open.weibo.com/wiki/API%E6%96%87%E6%A1%A3_V2) and follow the examples below.

If you want some more graceful and comfortable APIs, like: weibo.getUserDetail(), weibo.update() and etc, you can wrap it with your own Class.


## Introduction in Chinese

这是一个简单的基于OAuth2的[node.js](http://nodejs.org)新浪微博API客户端。

它定位于一个底层SDK，以保持其调用的灵活性及接口的稳定性。

它像是一个服务器端API的镜像，没有对接口进行自己的封装，你只需要阅读 [新浪微博的API](http://open.weibo.com/wiki/API%E6%96%87%E6%A1%A3_V2)，并参考下面的例子便可成功调用。

如果你想要用更为优雅的接口，例如：weibo.getUserDetail(), weibo.update() 等等，你可以自己封装一些你要用的API到你自己的Wrapper类中。


## Example

    var weibo = new SinaWeibo(clientId, clientSecret, accessToken);

    weibo.GET('users/show',{uid:'1564554685'}, function (err, resultInJson, response) {
        if (err) return callback(err);
        // do something with resultInJson
    });

## Example 2: The SPECIAL api - Upload
Upload in node-sina-weibo is special, a files object is separated from the params object.

文件上传的情况在比较特殊，params参数对象分离出了一个files参数

    weibo.UPLOAD('statuses/upload',
        { status:'your content' }, { pic:'pathToYourPicture' }, function (err, resultInJson, response) {
            if (err) return callback(err);
            // do something with resultInJson
        }
    );

## Installation

    $ npm install node-sina-weibo

