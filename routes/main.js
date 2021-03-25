const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer');
const config = require('../config.json');
const db = require('../db/index');

router.get('/',  (req, res, next) => {
  const {products, skills} = getDataForMainPage();
  res.render('pages/index', {title: 'Main page', products, skills})
})

router.post('/',  (req, res, next) => {
  if (!req.body.name || !req.body.email || !req.body.message) {
    const {products, skills} = getDataForMainPage();
    return res.render('pages/index', {
      title: 'Main page',
      products,
      skills,
      msgemail: 'Все поля нужно заполнить!',
    })
  }
  const transporter = nodemailer.createTransport(config.mail.smtp)
  const mailOptions = {
    from: `"${req.body.name}" <${req.body.email}>`,
    to: config.mail.smtp.auth.user,
    subject: config.mail.subject,
    text:
      req.body.message.trim().slice(0, 500) +
      `\n Отправлено с: <${req.body.email}>`
  }

  transporter.sendMail(mailOptions, function  (error, info) {
    const {products, skills} =  getDataForMainPage();
    if (error) {
      return res.render('pages/index', {
        title: 'Main page',
        products,
        skills,
        msgemail: `При отправке письма произошла ошибка!: ${error}`
      })
    }
    return res.render('pages/index', {
      title: 'Main page',
      products,
      skills,
      msgemail: `Сообщение успешно отправлено!`
    })
  })
})

function getDataForMainPage() {
  const products =  db.get('products').value();
  const skills =  db.get('skills').value();
  return {
    products,
    skills
  }
}

module.exports = router
