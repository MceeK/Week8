const mongoose = require('mongoose');
const Actor = require('../models/actor');
const Movie = require('../models/movie');
module.exports = {
    getAll: function (req, res) {
        Actor.find(function (err, actors) {
            if (err) {
                return res.status(404).json(err);
            } else {
                res.json(actors);
            }
        }).populate('movies');
    },
    createOne: function (req, res) {
        let newActorDetails = req.body;
        newActorDetails._id = new mongoose.Types.ObjectId();
        let actor = new Actor(newActorDetails);
        actor.save(function (err) {
            res.json(actor);
        });
    },
    getOne: function (req, res) {
        Actor.findOne({ _id: req.params.id })
            .populate('movies')
            .exec(function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                res.json(actor);
            });
    },
    updateOne: function (req, res) {
        Actor.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            res.json(actor);
        });
    },
    deleteOne: function (req, res) {
        Actor.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        });
    },
    deleteAllMovies: function (req, res) {
        actID = req.params.id;
        Movie.deleteMany({actors: actID}, function (err) {
            if (err) {
                return res.status(400).json(err);
            }else{
                Actor.findOneAndRemove({_id: actID}, function (err) {
                    if (err) return res.status(400).json(err);
                    res.json();
                });
            };
        });
    },

    deleteMovies: function (req, res) {
        let actID = req.params.actid;
        let movID = req.params.movid;
        Actor.findOne({_id: actID}, function(err, actor){
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            actor.movies.splice(actor.movies.indexOf(movID), 1);
            actor.save(function (err) {
                if (err) return res.status(500).json(err);
                res.json(actor);
            });
        });
    },

    addMovie: function (req, res) {
        Actor.findOne({ _id: req.params.id }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            Movie.findOne({ _id: req.body.id }, function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                actor.movies.push(movie._id);
                actor.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(actor);
                });
            })
        });
    }
};