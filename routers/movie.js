var Actor = require('../models/actor');
var Movie = require('../models/movie');
const mongoose = require('mongoose');
module.exports = {
    getAll: function (req, res) {
        Movie.find(function (err, movies) {
            if (err) return res.status(400).json(err);
            res.json(movies);
        }).populate('actors');
    },
    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);
            res.json(movie);
        });
    },
    getOne: function (req, res) {
        Movie.findOne({ _id: req.params.id })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                res.json(movie);
            });
    },
    updateOne: function (req, res) {
        Movie.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        });
    },
    deleteOne: function (req, res) {
        Movie.findOneAndRemove({ _id: req.params.id }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        });
    },
    deleteActors: function (req, res) {
        let movID = req.params.movid;
        let actID = req.params.actid;
        Movie.findOne({_id: movID}, function(err, movie){
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            movie.actors.splice(movie.actors.indexOf(actID), 1);
            movie.save(function (err) {
                if (err) return res.status(500).json(err);
                res.json(movie);
            });
        });
    },
    updateActor: function (req, res) {
        let movID = req.params.movid;
        let actID = req.params.actid;
        Movie.findOne({_id: movID}, function(err, movie){
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            movie.actors.push(actID);
            movie.save(function (err) {
                if (err) return res.status(500).json(err);
                res.json(movie);
            });
        });
    },
    getYears: function (req, res) {
        let year1 = parseInt(req.params.year1);
        let year2 = parseInt(req.params.year2);
        Movie.find({$and: [{year: {$gte: year2}}, {year: {$lte: year1}}]}, function(err, movie){
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        });
    }
};