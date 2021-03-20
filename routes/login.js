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

  try {
    const user = db.get('users').find({email, password}).value();
    if (!user) {
      res.render('pages/login', {title: 'SigIn page', msglogin: 'Check info'})
    } else {
      req.session.isAdmin = true;
      res.redirect('/admin');
    }
  } catch (err) {
    console.log(err);
  }

  return '';
})

module.exports = router
