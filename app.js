const Promise = require('bluebird');
const _ = require('lodash');
const Readable = require('stream').Readable;

var client = require('pkgcloud').storage.createClient({
    provider: 'amazon',
    keyId: 'accessKeyId', // access key id
    key: 'secretAccessKey', // secret key
    region: 'region' // region
 });
client.removeFileAsync = Promise.promisify(client.removeFile, {multiArgs:true});

function upload(options, buffer) {
    return new Promise((resolve, reject) => {
        function cleanup() {
          stream.removeListener('error', onerror);
          stream.removeListener('success', onsuccess);
        }
  
        function onerror(err) {
          cleanup();
          reject(err);
        }
  
        function onsuccess(file) {
          cleanup();
          resolve(file.toJSON());
        }
  
        const stream = client.upload(options);
        stream.once('error', onerror);
        stream.once('success', onsuccess);
        stream.end(buffer);
      });
}

opts = {
    container: 'sf-demos',
    remote: 'Intern.pdf'
};
upload(opts, new Buffer(JSON.stringify({ name: 'visarg', id: 29 }, null, 2), 'utf8'))
.then(data => {
    console.log('Upload Successfull');
    console.log(data);
})
.catch(err => console.log(err));

/*client.removeFileAsync('sf-demos', 'Intern.pdf')
.then(() => console.log('SuccessFully deleted..'))
.catch(err => console.log(err))
.catchThrow(new Error('Object is not there'));*/

/*function streamToPromise(stream, options) {
    const encoding = _.get(options, 'encoding', 'utf8');
    const objectMode = _.get(options, 'objectMode', false);
    if (!(stream instanceof Readable)) {
      stream = new Readable().wrap(stream);
    }
    return new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('readable', () => {
        let chunk;
        while ((chunk = stream.read())) {
          if (!objectMode) {
            chunk = chunk.toString(encoding);
          }
          chunks.push(chunk);
        }
      });
      stream.on('end', () => {
        resolve(objectMode ? chunks : chunks.join(''));
      });
      stream.on('error', reject);
    });
}

function download(options) {
    return Promise
      .try(() => client.download(options))
      .then(streamToPromise)
}

opts = {
    'container' : 'sf-demos',
    'remote' : 'access-logs/2020-01-22-07-19-31-09D3B848F57566C0'
};

download(opts)
.then(data => {
    console.log(data);
    const response = JSON.parse(data);
    console.log(response);
})
*/

// client.getContainer('sf-demos', function(err, container) {
//     if(err) console.log(err, err.stack);
//     else {
//         console.log(container);    
//     }
// });

// client.getFilesAsync = Promise.promisify(client.getFiles, {
//     multiArgs: true
//   });

// client.getFilesAsync('sf-demos', {})
//     .then(listOfFiles => {
//     let list = [];
//     let isTruncated = false;
//     if (listOfFiles[0] instanceof Array) {
//         list = listOfFiles[0];
//         isTruncated = _.get(listOfFiles[1], 'isTruncated') ? true : false;
//     } else {
//         list = listOfFiles;
//     }
//     const files = [];
//     _.each(list, file => files.push(_
//         .chain(file)
//         .pick('name', 'lastModified')
//         .set('isTruncated', isTruncated)
//         .value()
//     ));
//     console.log(files.length);
//     });