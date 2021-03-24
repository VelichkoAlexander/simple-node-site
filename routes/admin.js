const express = require('express')
const router = express.Router()
const {skills} = require('../db/db.json')
const db = require('../db/index');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

const validation = (fields, files) => {
  if (files.photo.name === '' || files.photo.size === 0) {
    return {status: 'No image', err: true}
  }
  if (!fields.name) {
    return {status: 'No name', err: true}
  }
  if (!fields.price) {
    return {status: 'No price', err: true}
  }
  return {status: 'OK', err: false}
}

const isAdmin = (req, res, next) => {
  console.log(req.session)
  if (req.session.isAdmin) {
    return next()
  }
  res.redirect('/login')
}

router.get('/', isAdmin, (req, res, next) => {
  res.render('pages/admin', {title: 'Admin page', skills})
})

router.post('/skills', async (req, res, next) => {
  const validField = ['age', 'concerts', 'cities', 'years'];
  const newSkills = req.body;
  for (const name in newSkills) {
    if (Object.prototype.hasOwnProperty.call(newSkills, name) && newSkills[name] && validField.some(field => name === field)) {
      await db.get('skills')
        .find({name: name})
        .assign({number: newSkills[name]})
        .write()
    }
  }

  return res.redirect('/admin');
})

router.post('/upload', (req, res, next) => {
  const form = formidable();
  const upload = path.join('./public', 'upload');

  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload)
  }

  form.uploadDir = path.join(process.cwd(), upload)

  form.parse(req, function (err, fields, files) {
    if (err) {
      return next(err)
    }

    const valid = validation(fields, files)

    if (valid.err) {
      fs.unlinkSync(files.photo.path)
      return res.redirect(`/?msg=${valid.status}`)
    }
    const fileNameForSave = files.photo.name.replace(/\s/g, '-')
    console.log(fileNameForSave)
    const fileName = path.join(upload, fileNameForSave)
    fs.rename(files.photo.path, fileName, function (err) {
      if (err) {
        console.error(err.message)
        return
      }
      db.get('products')
        .push({src: path.join('/upload', fileNameForSave), name: fields.name, price: Number(fields.price)})
        .write()
      res.redirect('/');
    })
  })
})


module.exports = router;
