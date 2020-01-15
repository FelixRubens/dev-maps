const axios = require('axios');
const Dev = require('../models/Dev');
const stringAsArray = require('../utils/stringAsArray.js');

module.exports = {
    async store(req, res){
        const { github_username, techs, latitude, longitude } = req.body
        
        const devExists = await Dev.findOne({github_username})

        if(devExists) return res.json(devExists)

        const gitResponse = await axios.get(`https://api.github.com/users/${github_username}`)
    
        const { name = login, avatar_url, bio } = gitResponse.data
    
        const techsArray = stringAsArray(techs)
    
        const location = {
            type: 'Point',
            coordinates: [longitude, latitude]
        }
    
        const devAdded = await Dev.create({
            github_username,
            name,
            avatar_url,
            bio,
            techs: techsArray,
            location
        });
    
        return res.json(devAdded)
    },

    async index(req, res){
        const allDevs = await Dev.find();

        return res.json(allDevs)
    } 
}