const express = require('express');

// https://github.com/node-formidable/node-formidable
const Formidable = require('formidable'); 
const util = require('util');

//https://www.npmjs.com/package/dotenv
const cloudinary = require("cloudinary");
require('dotenv').config()

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});
 
app.get('/', (req, res) => {
  res.send(`
    <form action="/api/upload" enctype="multipart/form-data" method="post">
      <input type="text" name="title" /><br/>
      <input type="file" name="upload" multiple="multiple" /><br/>
      <input type="submit" value="Upload" />
    </form>
  `);
});
 
app.post('/api/upload', (req, res, next) => {

  const form = new Formidable();

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    console.log('files: ', files)
    //https://cloudinary.com/documentation/upload_images
    cloudinary.uploader.upload(files.upload.path, result => {

      console.log('result', result) // en el result está la url de la imagen 
      if (result.public_id) {
          res.writeHead(200, { 'content-type': 'text/plain' });
          res.write('received upload:\n\n');
          res.end(util.inspect({ fields: fields, files: files }));
      }
    });

  });
});
 
app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000 ...');
});