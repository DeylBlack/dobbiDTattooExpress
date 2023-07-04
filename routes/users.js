var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const Users = require('../models/Users')
const bcrypt = require('bcryptjs');

/* GET users listing. */
router.post(
    '/isCanActivate',
    [
      check('login', 'Incorrect name').exists(),
      check('password', 'Incorrect password').exists(),
    ],
    async (req, res) => {
      try {
        const { login, password } = req.body;
        const admin = await Users.findOne({ login });

        if (admin.role === 'adminDobbiDTattoo' || admin.role === 'developerDobbiDTattoo') {
          res.json(true);
        } else {
          res.json(false);
        }
      } catch (e) {
        res.status(500).json({message: 'Ooops... Seems like server returned the error'})
      }
    });

router.post(
    '/register',
    [
      check('login', 'Incorrect Login.').isLength({ min: 1 }),
      check('password', 'Incorrect password').isLength({ min: 4 })
    ],
    async (req, res) => {
      console.log(req.body)
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({
            errors: errors.array(),
            massage: 'Incorrect data'
          })
        }

        const { login, password } = req.body;
        const candidate = await Users.findOne({ login });
        console.log(candidate)

        if (candidate) {
          return res.status(400).json({ message: 'User already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        console.log(hashedPassword)
        const user = new Users({ login, password: hashedPassword });

        console.log(user)

        await user.save();

        res.status(201).json({ message: 'User successfully created.' })

      } catch (e) {
        res.status(500).json({ message: 'Server error, try again.', e });
      }
    });

router.post(
    '/login',
    [
      check('login', 'Incorrect name').exists(),
      check('password', 'Incorrect password').exists(),
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({
            errors: 'Incorrect data',
            message: 'Incorrect data',
          })
        }

        const { login, password } = req.body;

        const user = await Users.findOne({ login });

        if (!user) {
          return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(400).json({ message: 'Incorrect password' });
        }

        const findUser = {
          id: user.id,
          login: user.login,
        }

        res.json(findUser);

      } catch (e) {
        res.status(500).json({message: 'Ooops... Seems like server returned the error'})
      }
    });

module.exports = router;
