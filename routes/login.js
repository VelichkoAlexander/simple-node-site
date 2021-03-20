const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('pages/login', { title: 'SigIn page' })
})

router.post('/' , (req, res, next) => {
  // TODO: Реализовать функцию входа в админ панель по email и паролю
  console.log(req.session)
  console.log(req.body);
  res.send('Реализовать функцию входа по email и паролю')
})

module.exports = router
