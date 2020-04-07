const Dev = require('../models/Devs');
const StringToArray = require('./util/SplitArray');


module.exports = {

    async index(request, response){
        //bucas Devs em raio de 10km e por tecnologia
        const {latitude, longitude, techs} = request.query;

        const techArray = StringToArray(techs);
        let devs

        if(techs){
            devs = await Dev.find({
                techs: {
                    $in: techArray
                }
                ,
                
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [longitude, latitude]
                        },
                        $maxDistance: 10000,
                    }
                }
            });
        } else {
            devs = await Dev.find({
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [longitude, latitude]
                        },
                        $maxDistance: 10000,
                    }
                }
            });
        };
        
        return response.json({devs});
    }
};