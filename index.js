const express = require('express');
const Formidable = require('formidable'); 
const util = require('util');
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
    <h2>With <code>"express"</code> npm package</h2>
    <form action="/api/upload" enctype="multipart/form-data" method="post">
      <div>Text field title: <input type="text" name="title" /></div>
      <div>File: <input type="file" name="someExpressFiles" multiple="multiple" /></div>
      <input type="submit" value="Upload" />
    </form>
  `);
});
 
app.post('/api/upload', (req, res, next) => {
  // const form = formidable({ multiples: true });
  const form = new Formidable();

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    cloudinary.uploader.upload(files.upload.path, result => {

      console.log(result)
      if (result.public_id) {
          res.writeHead(200, { 'content-type': 'text/plain' });
          res.write('received upload:\n\n');
          res.end(util.inspect({ fields: fields, files: files }));
      }
    });

    res.json({ fields, files });
  });
});
 
app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000 ...');
});