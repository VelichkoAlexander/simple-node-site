const express = require('express')
const router = express.Router()
const db = require('../db/index')

router.get('/', (req, res) => {
  res.render('pages/login', {title: 'SigIn page'})
})

router.post('/', async (req, res) => {
  const {email, password} = req.body

  if (!email && !password) {
    res.render('pages/login', {title: 'SigIn page', msglogin: 'Check info'})
    return;
  }

  const user = db.get('users').find({email, password}).value();
  if (!user) {
    res.render('pages/login', {title: 'SigIn page', msglogin: 'Check info'})
  } else {
    console.log(req.session)
    req.session.isAdmin = true;
    res.redirect('/admin');
  }

})

module.exports = router
