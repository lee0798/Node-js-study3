var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser=require('body-parser');
var passport =require('passport');
var LocalStrategy = require('passport-local').Strategy;
var md5 = require('md5');
var app =express();
app.use(bodyParser.urlencoded({ extended:false}));
app.use(session({
    secret: '12e2eqwewas',
    resave: false,
    saveUninitialized:true,
    store:new FileStore()
}));
app.use(passport.initialize());
app.use(passport.session());
app.get('/count', function(req,res){
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1;
    }
    res.send('count: '+req.session.count);
});
app.get('/auth/logout', function(req,res){
    delete req.session.displayName;
    res.redirect('/welcome');

});
app.get('/welcome', function(req,res){
    if(req.session.displayName){
        res.send(`
        <h1>Hello,${req.session.displayName}</h1>
        <a href="/auth/logout">logout</a>
        `);
    }else{
        res.send(`
        <h1>Welcome</h1>
        <a href="/auth/login">Login</a>
        `);

    }
});

passport.use(new LocalStrategy(
    function(username, password, done){
        var uname = username;
        var pwd = password;
        for(var i=0;i<users.length;i++){
            var user = users[i]
            if(uname===user.username){
                return hasher({password:pwd, salt:user.salt}, 
                function(err,pass, salt, hash){
                    if(hash ===user.password){
                        done(null,user);
                    }else{
                        done(null, false);
                    }
                })
            }
        }
        done(null, false);
    }
));


app.post(
    '/auth/login',
    passport.authenticate(
     'local', 
     {
        successRedirect:'/welcome',     
        failureRedirect: '/auth/login',
        failureFlash:false
     }
    )
);
/*app.post('/auth/login', function(req,res){
    var salt='!@E@FYUG*G!';
    var user={
        username:'도환',
        password:'202cb962ac59075b964b07152d234b70',
        displayName:'도로롱'
    };
    var uname = req.body.username;
    var pwd =req.body.password;
    if(uname===user.username&& md5(pwd+salt)===user.password){
        req.session.displayName=user.displayName;
        res.redirect('/welcome');
    }else{
        res.send('who are U?<a href="/auth/login">login</a>');
    }
});*/
app.get('/auth/login', function(req,res){
    var output=`
    <h1>LOGIN</h1>
    <form action="/auth/login" method="post">
     <p>
        <input type="text" name="username" placeholder="username">
     </p>
     <p>
         <input type="password" name="password" placeholder="password">
     </p>
     <p>
        <input type="submit">
     </p>
    </form>
    `;
    res.send(output);
});
app.listen(3003, function(){
    console.log('connected 3003!');
});