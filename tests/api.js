var should = require('should'),
    util = require('util'),
    SinaWeibo = require('..');

describe("Class SinaWeibo", function () {

    before(function (done) {
        done();
    });

    after(function (done) {
        done();
    });

    var weibo = new SinaWeibo("1811757010", "6cedd7fc4aa38824f019d4c9aba6a151", "2.00zIishBQlwbyB0c85eef360X1cVKE");

    describe('#users$show()', function () {
        it('should return a user info', function (done) {
            var url = weibo.users$show({
                    uid:'1564554685'
                }, function (err, response, results) {
                    if (err) {
                        console.error(err);
                        return done(err);
                    }

                    console.log(util.inspect(results));
                    accessToken.length.should.be.above(10);
                    done();
                }
            );
        });
    });

});
