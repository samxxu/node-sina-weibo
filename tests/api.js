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

    var weibo = new SinaWeibo("1811757010", "6cedd7fc4aa38824f019d4c9aba6a151", "2.00zIishBQlwbyBb12375b5a4HxvhAE");

//    describe('#statuses/update', function () {
//        it('should create a new weibo', function (done) {
//            weibo.POST('statuses/update', { status:'a test weibo' + Math.random() }, function (err, result, response) {
//                if (err) {
//                    console.error(err);
//                    return done(err);
//                }
//
//                console.log(util.inspect(result));
//                done();
//            });
//        });
//    });

    describe('#statuses/upload', function () {
        it('should upload a weibo with pic', function (done) {
            weibo.UPLOAD('statuses/upload',
                { status:'test test' + Math.random() }, { pic:'fixture/3444972239962243715.jpg' },
                function (err, result, response) {
                    if (err) {
                        console.error(err);
                        return done(err);
                    }
                    console.log(util.inspect(result));

                    weibo.UPLOAD('statuses/upload',
                        { status:'test test' + Math.random() }, { pic:'http://nodejs.org/images/logo.png' },
                        function (err, result, response) {
                            if (err) {
                                console.error(err);
                                return done(err);
                            }

                            console.log(util.inspect(result));
                            done();
                        });
                }
            );
        });
    });

});
