var should = require('should'),
    SinaWeibo = require('..');

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
            console.log('url>>' + url);
            url.length.should.be.above(10);
            done();
        });
    });

    describe('#getAccessToken()', function () {
        it('should return a valid AccessToken', function (done) {
            var url = weibo.getAccessToken('dc70297a9bfab4f20ba54e914bd7a951', {
                        grant_type:'authorization_code',
                        redirect_uri:'http://runmyjs.com/callback'
                    }, function (err, accessToken, refreshToken, results) {
                        if (err) {
                            console.error(err);
                            return done(err);
                        }
                        console.log('accessToken:' + accessToken);
                        console.log('refreshToken:' + refreshToken);
//                console.log(require('util').inspect(results));
                        accessToken.length.should.be.above(10);
                        done();
                    }
                )
                ;
        });
    });

});
