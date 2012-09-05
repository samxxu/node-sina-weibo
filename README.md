A simple [node.js](http://nodejs.org) OAuth2 client for Sina Weibo API. It is designed to be a low level SDK to gain flexibility and stability.

Without any wrapper APIs, it's like a mirror to the server side APIs. All you need to do is to read the [Sina Weibo API](http://open.weibo.com/wiki/API%E6%96%87%E6%A1%A3_V2) and follow the examples below.

If you want some more graceful and comfortable APIs, like: weibo.getUserDetail(), weibo.update() and etc, you can wrap it with your own Class.


## Introduction in Chinese

这是一个简单的基于OAuth2的[node.js](http://nodejs.org)新浪微博API客户端。

它定位于一个底层SDK，以保持其调用的灵活性及接口的稳定性。

它像是一个服务器端API的镜像，没有对接口进行自己的封装，你只需要阅读 [新浪微博的API](http://open.weibo.com/wiki/API%E6%96%87%E6%A1%A3_V2)，并参考下面的例子便可成功调用。

如果你想要用更为优雅的接口，例如：weibo.getUserDetail(), weibo.update() 等等，你可以自己封装一些你要用的API到你自己的Wrapper类中。

欢迎在微博上与我沟通[@VM-SAM](http://weibo.com/pandasam)

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

## A Typical Authorization Example

For more details, please refer to [Sina Weibo Authorization Documentation](http://open.weibo.com/wiki/%E6%8E%88%E6%9D%83%E6%9C%BA%E5%88%B6%E8%AF%B4%E6%98%8E)

请参阅[新浪微博授权机制说明](http://open.weibo.com/wiki/%E6%8E%88%E6%9D%83%E6%9C%BA%E5%88%B6%E8%AF%B4%E6%98%8E)

### Step 1 : Get the Authorize Url

    var weibo = new SinaWeibo(clientId, clientSecret);

    var url = weibo.getAuthorizeUrl({
        redirect_uri:'http://your-website.com/callback',
        response_type:'code'
    });

A code will be provided to the http://your-website.com/callback?code=the-code-you-get.

### Step 2 : Get the Access Token with the code got in step 1

    weibo.getAccessToken({
            code:'the-code-got-in-step-1',
            grant_type:'authorization_code',
            redirect_uri:'http://your-website.com/callback'
        }, function (err, result, accessToken) {
            if (err) return callback(err);
            // your code here.
            // weibo.GET(...)
        }
    );


##Installation

    $ npm install node-sina-weibo

