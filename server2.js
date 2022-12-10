const express=require("express");
const app=express();
app.set("view engine","ejs");
const mongoose=require("mongoose");
require('dotenv').config();
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(__dirname+"/views"));////////Important to check it before running app...
app.listen(3200,function(){
    console.log('started');
});
mongoose.set('strictQuery', true);
// mongoose.connect("mongodb://localhost:27017/dbproject",{useNewUrlParser:true});
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true})
.then(()=>console.log('connected to db'))
.catch(err=>console.log(err));
// mongoose.connect("mongodb://127.0.0.1:27017/dbproject",{useNewUrlParser:true});


const Schema1=new mongoose.Schema({
    user:String,
    password:String,
    date:String,
    item:String
});
const Schema2=new mongoose.Schema({
    username:String,
    password:String,
    
});
const Todolists=mongoose.model("Todolists",Schema1);
const Todocreds=mongoose.model("Todocreds",Schema2);
app.get("/",function(req,res){

    console.log('get requested');
    // res.render("login.ejs",{udescrip:"",
    //                         pdescrip:"",
    //                         user_value:"",
    //                         password_value:""});
    res.redirect("/login");

});
// app.get("/home",function(req,res){

//     console.log('get /home requested');
//     res.render("login.ejs",{udescrip:"",
//                             pdescrip:"",
//                             user_value:"",
//                             password_value:""});

// });
app.post("/signup",function(req,res){
    console.log(req.body);
    var body=req.body;
    var user=body.fname,password=body.password;
    if(body.password==body.confirmpassword)
    {
        Todocreds.find({username:user,password:password},function(err,result){
            if(result.length>0)
            {
                res.render("signup.ejs",{passdescrip:"User already exists"});
            }
            else if(result.length==0)
            {
                Todocreds.insertMany([{username:user,password:password}],function(err){
                    if(err)
                    {
                        console.log('not inserted');
                        res.render("signup.ejs",{passdescrip:"Error..Plz try again"});
                    }
                    else{
                        console.log('inserted entry');
                        res.redirect("/login");
                    }
                });
                
                // res.render("login.ejs",{pdescrip:"",user_value:"",password_value:""});
            }
        })
        
        
    }
    else{
        res.render("signup.ejs",{passdescrip:"Confirm password correctly..."});
    }
});

app.get("/signup",function(req,res){
    res.render("signup.ejs",{passdescrip:""});
});
app.get("/login",function(req,res){
    res.render("login.ejs",{pdescrip:"",user_value:"",password_value:""});
});
app.post("/home",function(req,res){
    console.log('post/home requested');
    var date2=new Date(req.body.ipdate);//to convert date into string-->ex:fri august 6 2022
    var datestring=date2.toDateString();
    var items_arr=[];
    var body=req.body;
    var date1=body.ipdate,user1=body.user,password1=body.password;
    console.log(req.body);
    if(req.body.btn=='btnpostdate')
    {
        f();
       
        
    }
    else if(body.btn=='btnadditem')
    {
        var body=req.body;
        Todolists.insertMany([{user:user1,password:password1,item:body.ip,date:date1}],function(err){
            if(err)
            {
                console.log("error");
            }
            else
            {
                console.log("inserted"+date1+body.ip);
                f();
            }
        });

    }
    else if(body.btn=="go_home")
    {

        res.render("index.ejs",{user:body.user,password:body.password})
    }
    else if(body.btn=='login')
    {
        user1=body.username;
        password1=body.password;
        Todocreds.find({user:user1,password:password1},function(err,result){
            if(err)
            {
                console.log('error');
            }
            else
            {
                if(result.length>0)
                {
                    console.log('displaying index.ejs');
                    res.render("index.ejs",{user:user1,password:password1});             
                }
                else
                {
                   
                    res.render("login.ejs",{pdescrip:"No matching credentials..!",user_value:user1,password_value:""})
                }
            }
        })
       
    }
    else if(body.btn=="log_out")
    {
        res.render("login.ejs",{pdescrip:"",user_value:"",password_value:""});
    }
    else if(body.btn=='btncheckbox')
    {
        Todolists.deleteOne({user:user1,password:password1,date:date1,item:body.ip},function(err){
            if(err)
            {
                console.log('error');
            }
            else
            {
                console.log('deleted '+body.ip);
                setTimeout(f,300);
            }
        })
    }

    
    
    
    
    
    
    
    
    
    
    
    
    function f()
    {
        Todolists.find({user:user1,password:password1,date:date1},function(err,result){
            if(err)
            {
                console.log('error');
            }
            else
            {
                console.log('retrieved',result);
                for(var i=0;i<result.length;i++)
                {
                    items_arr.push(result[i].item);
                }
            }
            res.render("list3.ejs",{dbno:1,
                items:items_arr,
                 day:datestring,
                ipdate:req.body.ipdate,
                user:user1,
                password:password1});
    })
    }
//     Todolists.insertMany([
//     {user:"laddu222",
//      password:"hello222",
//      date:req.body.ipdate,
//      item:"item222"
//     }
// ],function(err){
//     console.log('hello');
//     if(err)
//     console.log('err');
//     else
//     {
//         console.log("inserted");
        
//     }
//     res.send("done");
// });
});