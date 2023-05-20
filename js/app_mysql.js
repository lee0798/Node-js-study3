const express= require('express');
const app = express();

const bodyParser = require('body-parser');
const mysql =require('mysql2');
const { log } = require('console');
app.locals.pretty=true;
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'pug');
app.set('views',__dirname+'/views_mysql');
const conn =mysql.createConnection({
    host    : '127.0.0.1',
    user    : 'root',
    password    : 'dohwan1031!',
    database    : 'o2'
});
conn.connect();


  

app.get('/topic/add',function(req,res){
  var sql = 'select id,title from topic';
  conn.query(sql,function(err,topics,fileds){
      if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
      }
      else{
          res.render('add', {topics:topics});
      }
  });
});
app.post('/topic/add',function(req,res){
  const title=req.body.title;
  const description=req.body.description;
  const author=req.body.author;
  var sql = 'INSERT INTO topic (title, description, author) VALUES(?, ?, ?)';
  conn.query(sql, [title, description, author], function(err, result, fields){
      if(err){
          res.status(500).send("error");
      }else{
      res.redirect('/topic/'+result.insertId);
      }
  });
})


app.get(['/topic/:id/edit'],function(req,res){
    var sql = 'select id,title from topic';
    conn.query(sql,function(err,topics,fileds){
        var id = req.params.id;
        if(id){
            var sql = 'select * from topic where id =?';
            conn.query(sql,[id],function(err,topic,fields){
                if(err){
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                }
                else{
                    res.render('edit',{topics:topics,topic:topic[0]});
                }
            });
        }
        else{
            console.log('There is no id.');
            res.status(500).send('Internal Server Error');
        }
    });
})

app.get(['/topic/:id/delete'],function(req,res){
  var sql = 'select id,title from topic';
  var id = req.params.id;
  conn.query(sql,[id],function(err,topics,fields){
      var sql = 'select * from topic where id=?';
      conn.query(sql,[id],function(err,topic){
          if(err){
              console.log(err);
              res.status(500).send('Internal Server Error');
          }
          else{
              if(topic.length === 0){
                  console.log('There is no record.');
                  res.status(500).send('Internal Server Error');
              }
              else{
                  res.render('delete',{topics:topics, topic:topic[0]});
              }
          }
      });
  });
})

app.post(['/topic/:id/delete'],function(req,res){
  var id = req.params.id;
  var sql = 'delete from topic where id=?';
  conn.query(sql,[id], function(err,results){
      res.redirect('/topic/');
  });
})

app.post(['/topic/:id/edit'],function(req,res){
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  var id = req.params.id;
  var sql = 'update topic set title=?, description=?, author=? where id=?';
  conn.query(sql,[title,description,author,id],function(err,result,fields){
      if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
      }
      else{
          res.redirect('/topic/'+id);
      }
  });
})
app.get(['/topic', '/topic/:id'], function(req, res) {
  var sql = 'SELECT id, title FROM topic';
  conn.query(sql, function(err, topics, fields) {
    var id = req.params.id;
    if (id) {
      var sql = 'SELECT * FROM topic WHERE id=?';
      conn.query(sql, [id], function(err, topic, fields) {
        if (err) {
          console.log(err);
          res.status(500).send("Error");
        } else {
          res.render('view', {topics: topics, topic: topic[0]});
        }
      });
    } else {
      res.render('view', {topics: topics});
    }
  });
});


app.listen(3000, function(){
    console.log('connected 3000port!' );
});