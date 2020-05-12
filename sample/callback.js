var fs = require('fs');

function callReadFile(callback) {
    fs.readFile('example/test.txt', 'utf8', function (err, result) {
        if(err) {
            console.error(err);
            throw err;
        }
        else {
            callback(result);
        }
    });
}

console.log('first func');
console.error('second func');

callReadFile(function (data) {
    console.log(data);
    console.log('third func');
})