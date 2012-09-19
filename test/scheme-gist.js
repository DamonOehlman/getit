var assert = require('assert'),
    getit = require('../'),
    snippet1, snippet2;

describe('gist scheme test', function() {
    before(function(done) {
        getit('https://raw.github.com/gist/3344823/gistfile1.md', function(err, content) {
            snippet1 = content;
            done(err);
        });
    });
    
    before(function(done) {
        getit('https://raw.github.com/gist/1261033/bridge-server.js', function(err, content) {
            snippet2 = content;
            done(err);
        });
    });

    it('should get the first file by gist id only', function(done) {
        getit('gist://3344823', function(err, content) {
            assert.ifError(err);
            assert.equal(content, snippet1);

            done(err);
        });
    });
    
    it('should get a specified file when specified', function(done) {
        getit('gist://3344823/gistfile1.md', function(err, content) {
            assert.ifError(err);
            assert.equal(content, snippet1);
        
            done(err);
        });
    });
    
    it('should error when a non-existant file is requested', function(done) {
        getit('gist://3344823/gistfile1.error', function(err, content) {
            assert(err);
            done();
        });
    });
    
    it('should get a specified file when the gist has more than one file', function(done) {
        getit('gist://1261033/bridge-server.js', function(err, content) {
            assert.ifError(err);
            assert.equal(content, snippet2);
            
            done();
        });
    });
});