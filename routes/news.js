/**
 * Created by navina on 11/10/16.
 */
var mongoose=require('mongoose');
var news=mongoose.model('news');



var collections = ['news'];

//var db = require('mongojs');


exports.add=function (req,res) {
    res.render("addnews-page")
};
exports.doAdd=function (req,res) {
    news.create({
        Tittle: req.body.Tittle,
        News:req.body.News,
        CreatedOn: Date.now(),
        DisplayDate:Date.now(),
        EndDate:Date.now(),
        ModifiedOn: Date.now()
    },function (err,news) {
        if(err){
            console.log(err);
            if(err.code===11000){
                res.redirect( '/news/add?exists=true' );
            }else{
                res.redirect('/?error=true');
            }

        }else {
            //Success
            console.log("news saved: " + news);
            res.redirect('/adminhome')
        }

    })
};
exports.view=function (req,res) {
    news.find(function(err, news) {
        keys=Object.keys(news);
        l=keys.length;
        console.log(keys);
        console.log(l);
        res.render('viewnews-page', {
            news: news,
            keys:keys
        })
    })

};
exports.getnews=function (req,res) {
    news.find(function(err, news) {
        if(!err){
            console.log(news);
            res.json(news);
        }else{
            console.log(err);
            res.json({"status":"error", "error":"Error finding news"});
        }

    })

};
exports.detailedview=function (req,res) {
    console.log(req.params.id);
    news.findOne({_id:req.params.id},function (err,news){
        if(!err){
            if (!news){
                console.log("no news");
                res.redirect('/news?404=error');
            }else {
                console.log("news found");
                res.render('detailed-news-view',{
                        "_id":news._id,
                        "Tittle":news.Tittle,
                        "News":news.News,
                        "Startdate":news.DisplayDate,
                        "Enddate":news.EndDate
                    }
                )
            }

        }else {
            console.log(err);
            res.redirect('/news?404=error');
        }
    });

};
exports.getspecificnews=function (req,res) {
    news.findOne({_id:req.params.id},function (err,news) {
        if(!err){
            console.log(news);
            res.json(news);
        }else{
            console.log(err);
            res.json({"status":"error", "error":"Error finding news"});
        }

    })
};
exports.delete=function (req,res) {
    console.log('delete function worked');
    console.log(req.params.id);
    if (req.params.id){
         console.log('Entered into if');
         console.log('paramas'+req.params.id);
         news.findByIdAndRemove(req.params.id,function (err,news) {
             if (err){
                 console.log(err);
                 return res.redirect('/news?error=deleting');
             }else {
                 console.log("news deleted");
                 res.redirect('/news/view')
             }

         })
    }
};
exports.edit = function(req, res){
    if (req.session.loggedIn !== true){
        res.redirect('/');
    }else{
        news.findOne({'_id':req.params.id}, function (err,news) {
            if(err){
                console.log(err);
                return res.redirect('/user?error=findingnews');
            }
            else {
                res.render('editnews', {
                    _id:news._id,
                    Tittle: news.Tittle,
                    News:news.News,
                    DisplayDate:news.DisplayDate,
                    EndDate:news.EndDate
                });
            }
        });


    }
};
exports.doEdit=function (req,res) {
    console.log(req.body.id);
    news.findById( req.body.id,
        function (err, news) {
            console.log(news);
            doEditSave (req, res, err, news);
        }
    );
};
var doEditSave = function(req, res, err, news) {
    if(err){
        console.log(err);
        res.redirect( '/user?error=finding');
    } else {
        news.Tittle = req.body.Tittle;
        news.News = req.body.News;
        news.modifiedOn = Date.now();
        news.DisplayDate=req.body.DisplayDate;
        news.EndDate=req.body.EndDate;
        news.save(
            function (err, news) {
                onEditSave (req, res, err, news);
            }
        );
    }
};
var onEditSave = function (req, res, err, news) {
    if(err){
        console.log(err);
        res.redirect( '/user?error=saving');
    } else {
        console.log('news updated');
        res.redirect('/adminhome')
    }
};