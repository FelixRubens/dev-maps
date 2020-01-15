const moongose = require('mongoose');
const PointSchema = require('./utils/PointSchema.js');


const DevSchema = new moongose.Schema({
    github_username: String,
    name: String,
    avatar_url: String,
    techs: [String],
    bio: String,
    location: {
        type: PointSchema,
        index: '2dsphere'
    }
});

module.exports = moongose.model('Dev', DevSchema);