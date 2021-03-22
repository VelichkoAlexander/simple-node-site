const express = require('express')
const router = express.Router()
const {skills} = require('../db/db.json')
const db = require('../db/index');

const isAdmin = (req, res, next) => {
  console.log(req.session)
  if (req.session.isAdmin) {
    return next()
  }
  res.redirect('/')
}

router.get('/', isAdmin, (req, res, next) => {
  res.render('pages/admin', {title: 'Admin page', skills})
})

router.post('/skills',  async (req, res, next) => {
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
  /* TODO:
   Реализовать сохранения объекта товара на стороне сервера с картинкой товара и описанием
    в переменной photo - Картинка товара
    в переменной name - Название товара
    в переменной price - Цена товара
    На текущий момент эта информация хранится в файле data.json  в массиве products
  */
  res.send('Реализовать сохранения объекта товара на стороне сервера')
})

module.exports = router
