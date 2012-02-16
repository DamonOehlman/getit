var fs = require('fs'),
    path = require('path'),
    expect = require('chai').expect,
    getit = require('../'),
    testContent,
    opts = {
        cwd: __dirname,
        aliases: {
            'test': 'github://DamonOehlman/getit/test/files'
        }
    };
    
describe('local loading test', function() {
    before(function(done) {
        fs.readFile(path.resolve(__dirname, 'files/test.txt'), 'utf8', function(err, data) {
            if (! err) {
                testContent = data;
            }
            
            done(err);
        });
    });
    
    it('should be able to load a remote file (using an alias)', function(done) {
        getit('test!test.txt', opts, function(err, data) {
            expect(err).to.not.exist;
            expect(data).to.equal(testContent);
            done(err);
        });
    });
});