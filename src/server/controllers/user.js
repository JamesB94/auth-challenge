const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const jwtSecret = 'hahashstdsfsd';
const saltRounds = 10

const register = async (req, res) => {
    const { username, password } = req.body;

    const hashedPass = await bcrypt.hash(password, saltRounds)

    const userCheck = await prisma.user.findUnique({
        where: {
          username,
        },
      });

      if (userCheck) {
        return res.json({
            error:"Pick a new username as this one is already taken",
          });
      }

    const createdUser = await prisma.user.create({
        data:{
            username,
            password: hashedPass
        }
    });
    //delete Password
    res.json({ data: createdUser });
};

const login = async (req, res) => {
    const { username, password } = req.body;

    const foundUser = await prisma.user.findUnique({
        where: {
          "username": username,
        },
      })

    if (!foundUser) {
        return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const passwordsMatch = await bcrypt.compare(password, foundUser.password);

    if (!passwordsMatch) {
        return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = jwt.sign(username, jwtSecret);

    res.json({ data: token });
};

module.exports = {
    register,
    login
};