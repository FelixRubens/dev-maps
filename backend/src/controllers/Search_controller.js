const Dev = require('../models/Dev');
const stringAsArray = require('../utils/stringAsArray.js');

module.exports = {
    async index(req, res){
        const { latitude, longitude, techs } = req.query
        const techsAsArray = stringAsArray(techs);

        const devs = await Dev.find({
            techs: {
                $in: techsAsArray,
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 10000
                }
            }
        })

        return res.json({devs})
    }
}