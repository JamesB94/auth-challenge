const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const jwtSecret = 'hafkjrekfhkdfj';

const getAllMovies = async (req, res) => {
    const movies = await prisma.movie.findMany();

    res.json({ data: movies });
};

const createMovie = async (req, res) => {
    const { title, description, runtimeMins } = req.body;

    const getToken = req.get("Authorization");


    if(!getToken) {
        return res.status(401).json({ error: "Invalid token provided." });
    }

    const createdMovie  = await prisma.movie.create({
        data: {
        title,
        description,
        runtimeMins,
        }
    })

    res.json({ data: createdMovie });
};

module.exports = {
    getAllMovies,
    createMovie
};