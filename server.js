const express=require("express");
const app=express();
app.set("view engine","ejs");
const mysql=require("mysql");
const bodyParser=require('body-parser');
const { query } = require("express");
app.use(bodyParser.urlencoded({extended:true}));

const pool=mysql.createPool({

    host :'localhost',
    user:  'root',
    password: '',
    database :'dbproject'
});


const date=new Date();
const day=date.getDay(); 

app.listen(3200,function(){
    console.log(('started'));
});
app.get("/",function(req,res){
    
    // if(day==0||day==6) 
    // // descrip='weekend'; //project-1
    // color='blue'//project-2
    // else
    // // descrip='weekday'; //project-1
    // color='red'; //project-2
    // const arr=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    
    // res.render("list",{ejsday:descrip});  //project-1
    
    // res.render("list",{ejsday:arr[day],colour:color,class:'h'});   //project-2
    // console.log(date.toDateString());

    pool.getConnection(function(err,conn){
        if(err)
        throw err;
        const query2="select * from dbtodo";
        conn.query(query2,function(err,rows){
            if(err)
            console.log(err);
            else
            {

            console.log('success');
            // console.log(JSON.parse(JSON.stringify(rows[1])).items);
            const items_arr=["h"];
            items_arr.pop();
            var sno_arr=[1];
            sno_arr.pop();
            for(var  i=0;i<rows.length;i++)
            {
                items_arr.push(rows[i].items);
                sno_arr.push(rows[i].sno);
            }
            res.render("list2.ejs",{day:date.toDateString(),
                                     dbno:rows.length,
                                     items:items_arr,
                                     sno:sno_arr});         
            }

        });
    })
    // res.render("list2.ejs",{day:date.toDateString(),dbno:5});
});


app.post("/",function(req,res){
    var a=req.body.ip;
    console.log(req.body);
    pool.getConnection(function(err,conn){
        if(err)
        throw err;
        var total_rows=0;
        var query1="select * from dbtodo";
        conn.query(query1,function(err,result){//doing this to find serial no
        if(err)
        console.log('error1');
        else
        total_rows=result.length+1;
        });
        console.log(total_rows);
        var query2="insert INTO dbtodo (sno,items) VALUES ('"+total_rows+"','"+a+"')";    
        conn.query(query2,function(err,result){    
            if(err)
            console.log('error2',total_rows);
            else
            {
                console.log('inserted' +a+'at '+total_rows);
                //res.redirect("/");////rdirect will make a get request to specified route(/-> home route here)
            }
        });
    })
})

           
app.post("/home",function(req,res){

    console.log(req.body);
    var btn=req.body.btn;//if btn.value=btnpostdate then we ned to retrieve data else if btn.value=btnadditem htn we ned to insrt item into database
    if(btn=='btnpostdate')
    {
        console.log("we're  in datepost!");
        // var date2=new Date(req.body.ipdate);//to convert date into string-->ex:fri august 6 2022
        // var datestring=date2.toDateString();


        // pool.getConnection(function(err,conn){
        //     if(err)
        //     throw err;
        //     var query2="select * from dbtodo2 where date='"+ req.body.date+"'";
        //     conn.query(query2,function(err,result){
        //         if(err)
        //         throw err;
        //         var items=[];
        //         console.log(result);
        //         for(var i=0;i<result.length;i++)
        //         {
        //             items.push(result[i].items);
        //         }
        //         res.render("list2",{day:datestring,
        //                              items:items,
        //                             dbno:'1',
        //                             ipdate:req.body.ipdate});
        //     })
        // })
    }
    else if(btn=='btnadditem')
    {
        // console.log(req.body);
        var items=req.body.ip;
        const date=req.body.ipdate;
        // const date =a.getFullYear()+'-'+(a.getMonth()+1) +'-'+ a.getDate();
        pool.getConnection(function(err,conn){
            if(err)
            throw err;

            const query2="insert into dbtodo2 (date,items) values('"+date+"','"+items+"')";
            conn.query(query2,function(err,result){
                if(err)
                {
                    console.log('error');
                }
                else
                {
                    console.log('inserted'+date,items);
                }
            });
        })
    }
    else if(btn=='btncheckbox')
    {
        var date2=new Date(req.body.ipdate);//to convert date into string-->ex:fri august 6 2022
        var datestring=date2.toDateString();
        console.log('deletion starts....');
        pool.getConnection(function(err,conn){
            if(err)
            throw err;
            const query2="delete from dbtodo2 where date='"+req.body.ipdate+"' and items='"+req.body.ip+"'";
            conn.query(query2,function(err,result){
                if(err)
                console.log('error');
                else
                console.log('deleted'+req.body.ip);
            });
           
        });

    }

    if(1)//for rendering the template
    {
        var time=0;
        if(btn=='btncheckbox')
        time=300;
        else
        time=100;

        setTimeout(fun,time);

        function fun()
        {
        var date2=new Date(req.body.ipdate);//to convert date into string-->ex:fri august 6 2022
        var datestring=date2.toDateString();
         pool.getConnection(function(err,conn){
            if(err)
            throw err;
            conn.query("select * from dbtodo2 where date=?",[req.body.ipdate],function(err,result){
                if(err){
                    console.log(err);
                }
                else
                {
                    var items=[];
                    console.log('o/p',result);
                    for(var i=0;i<result.length;i++)
                    {
                        items.push(result[i].items);
                    }
                    res.render("list2.ejs",{dbno:1,
                                            items:items,
                                             day:datestring,
                                            ipdate:req.body.ipdate});
                }
            })
         })
        }
    }



})