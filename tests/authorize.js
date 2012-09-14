var should = require('should'),
    util = require('util'),
    SinaWeibo = require('../lib');

describe("Class SinaWeibo", function () {

    before(function (done) {
        done();
    });

    after(function (done) {
        done();
    });

    var weibo = new SinaWeibo("1811757010", "6cedd7fc4aa38824f019d4c9aba6a151");

    describe('#getAuthorizeUrl()', function () {
        it('should return a valid authorize url', function (done) {
            var url = weibo.getAuthorizeUrl({
                redirect_uri:'http://runmyjs.com/callback',
                response_type:'code'
            });
            console.log('url : ' + url);
            url.length.should.be.above(10);
            done();
        });
    });

    describe('#getAccessToken()', function () {
        it('should return a valid AccessToken', function (done) {
            weibo.getAccessToken({
                    code:'91521da3dc5ca63b3dc45e8b6d21bdc9', // put here your authorize code which is got above via browser
                    grant_type:'authorization_code',
                    redirect_uri:'http://runmyjs.com/callback'
                }, function (err, results, accessToken) {
                    if (err) {
                        console.log(err.stack);
                        return done(err);
                    }
                    console.log('We have got an accessToken: ' + accessToken);
                    accessToken.length.should.be.above(10);
                    accessToken.should.equal(weibo._accessToken);
                    done();
                }
            );
        });
    });

    describe('#users/show', function () {
        it('should be able to call APIs', function (done) {
            weibo.GET('users/show', { uid:'1564554685' }, function (err, result, response) {
                if (err) {
//                    console.log('' + err.stack);
//                    err.

                    console.error(err);
                    return done(err);
                }

                console.log(util.inspect(result));
                done();
            });
        });
    });

});
