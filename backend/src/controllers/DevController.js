const axios = require('axios');
const Dev = require('../models/Devs');
const StringToArray = require('./util/SplitArray');
const { findConnections, sendMessage } = require('../websocket');

/*controller functions : 
index (= list) ; show (return one); store (=create); update ; destroy (delete)
*/

module.exports = {

    async index(request, response){
        const listAll = await Dev.find();
        return response.json(listAll);
    },

    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;
        
        //Do not store duplicates
        let newDev = await Dev.findOne({github_username});

        if(!newDev) {
            const gitApi = await axios.get(`https://api.github.com/users/${github_username}`);

            const { name = login, avatar_url, bio } = gitApi.data;
        
            const techArray = StringToArray(techs);
            //const techArray = techs.split(',').map(tech => tech.trim());
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
        
            newDev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techArray,
                location,
            });

            /*Filtrar as conexões que estão a menos de 10km de distancia
            e que o noo Dev tenha pelo menos uma das tecnologias criadas*/
            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techArray,
            );
            sendMessage(sendSocketMessageTo, 'new-dev', newDev);
        }

        return response.json(newDev);
    }
};