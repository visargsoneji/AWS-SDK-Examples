const S3 = require('aws-sdk/clients/s3');
const { resolve } = require('bluebird');
const Promise = require('bluebird');
const _ = require('lodash');
const Readable = require('stream').Readable;

let s3Config = {
    accessKeyId: 'accessKeyId',
    secretAccessKey: 'secretAccessKey',
    region: 'region',
    maxRetries: 10
  };
let s3 = new S3(s3Config);

s3.listObjectsAsync = Promise.promisify(s3.listObjects, {});
s3.deleteObjectAsync = Promise.promisify(s3.deleteObject, {});
s3.uploadAsync = Promise.promisify(s3.upload, {});

//--------LISTING OBJECTS FROM A BUCKET---------
s3Options = {
    Bucket : 'sf-demos'
};

s3.listObjectsAsync(s3Options)
.then(data => {
    let isTruncated = data.IsTruncated;
    let list = data.Contents;
    
    list.forEach(element => {
    element.name = element.Key;
    element.lastModified = element.LastModified;
    delete element.Key;
    delete element.LastModified;
    });

    const files = [];
    _.each(list, file => files.push(_
    .chain(file)
    .pick('name', 'lastModified')
    .set('isTruncated', isTruncated)
    .value()
));
console.log(files);
});

/*
//---------UPLOADING TO AN OBJECT-----------
function upload(options) {
    //console.log(JSON.parse(buffer));
    s3Settings = {
        queueSize: 1,
        partSize: 5 * 1024 * 1024
    }
    return s3.uploadAsync(options,s3Settings);   
}

opts = {
    Bucket: 'sf-demos', //BUCKET NAME
    Key: 'Intern.pdf',
    Body: new Buffer(JSON.stringify({ name: 'visarg', id: 29 }, null, 2), 'utf8')
};
upload(opts)
.then(data => {
    console.log('Upload Successfull');
    console.log(data);
    //for(prop in data)
        //console.log(prop);
})
.catch(err => console.log(err));*/


/*
//----------GET OBJECT---------
var params = {
    Bucket: "sf-demos", 
    Key: "Intern.pdf"
   };
   s3.getObject(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     console.log(data);           // successful response
});*/


/*
//----------DELETE OBJECT---------
let params = {
    Bucket: "sf-demos",
    Key: "Intern.pdf"
}
s3.deleteObjectAsync(params)
.then(data => {
    console.log('Successfully deleted..');
    console.log(data);
})
.catch(err => {
    console.log('Error in deleting Object:')
    console.log(err);
})
*/


/*
//---------CREATING A NEW OBJECT--------
var params = {
    Body: '0101100010', 
    Bucket: "sf-demos", 
    Key: "Intern.pdf"
};
s3.putObject(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});*/



/*
//---------DOWNLOAD OBJECT----------(as per sf)
function streamToPromise(stream, options) {
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
    s3Opt = {
        Bucket : options.container,
        Key : options.remote
    };

    return Promise
    .try(() => s3.getObject(s3Opt).createReadStream())
    .then(streamToPromise)   
}

opts = {
    container : 'sf-demos',
    remote : 'access-logs/2020-01-22-07-19-31-09D3B848F57566C0'
};
download(opts)
.then((objectData) => {
    const response = JSON.parse(objectData);
    console.log(response);
})*/


/*let params = {
    Bucket: "sf-demos", 
    Key: "access-logs/2020-01-22-07-19-31-09D3B848F57566C0"
   };
   s3.getObject(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     console.log(data.Body.toString("utf-8"));           // successful response
   });
*/