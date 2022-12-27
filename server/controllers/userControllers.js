const mysql=require('mysql');

//connection Pool
const pool=mysql.createPool({
    connectionLimit : 100,
    host            :process.env.DB_HOST,
    user            :process.env.DB_USER,
    password        :'',
    database        :process.env.DB_NAME
     
});


exports.view=(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err; // throws error if NotConnected
        console.log('Connected as ID '+ connection.threadId);
    

    //Connecting the query
    connection.query('SELECT * FROM User',(err,rows)=>{
        //Release the connection
        connection.release();

        if(!err){
            res.render('home',{rows});
        }else{
            console.log(err);
        }
        console.log('The Data from user Table : \n ',rows);
    })
})
}
//Finding By Search
exports.find=(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err; // throws error if NotConnected
        console.log('Connected as ID '+ connection.threadId);
    let searchTerm=req.body.search;
    console.log(searchTerm);

    //Connecting the query
    connection.query('SELECT * FROM User WHERE firstname = ? OR lastname LIKE ?',[searchTerm,'%'+searchTerm+'%'],(err,rows)=>{
        //Release the connection
        //With Using LIKE we need to pass value between % Sign and Data will be fetched as if any letters macthes with data
        //Without Using LIKE only exact word will fetched if spelling matches
        connection.release();

        if(!err){
            res.render('home',{rows});
        }else{
            console.log(err);
        }
        console.log('The Data from user Table : \n ',rows);
    })
})
}

exports.form=(req,res)=>{
    res.render('add-user');

}

exports.create=(req,res)=>{
const {firstname,lastname,email,phone,comment}=req.body;

pool.getConnection((err,connection)=>{
    if(err) throw err; // throws error if NotConnected
    console.log('Connected as ID '+ connection.threadId);


//Connecting the query
connection.query('INSERT INTO User SET firstname = ?,lastname = ?,email=?,phone=?,comments=?',[firstname,lastname,email,phone,comment],(err,rows)=>{
    //Release the connection
    connection.release();
    if(!err){
        res.render('add-user',{ message:`${firstname} ${lastname} Added in Database`});
       
    }else{
        console.log(err);
    }
    console.log('The Data from user Table : \n ',rows);
})
})

}       

exports.edit=(req,res)=>{
pool.getConnection((err,connection)=>{
    if(err) throw err; // throws error if NotConnected
    console.log('Connected as ID '+ connection.threadId);


//Connecting the query
connection.query('SELECT * FROM User WHERE id = ?',[req.params.id],(err,rows)=>{
    //Release the connection
    connection.release();

    if(!err){
        res.render('edit-user',{rows});
    }else{
        console.log(err);
    }
    console.log('The Data from user Table : \n ',rows);
})
})
}

exports.update = (req,res)=>{
    const {firstname,lastname,email,phone,comment}=req.body;

    pool.getConnection((err,connection)=>{
        if(err) throw err; // throws error if NotConnected
        console.log('Connected as ID '+ connection.threadId);
    
    
    //Connecting the query
    connection.query('UPDATE User SET firstname=?,lastname=?,email = ?, phone = ?, comments=? WHERE id = ?',[firstname,lastname,email,phone,comment,req.params.id],(err,rows)=>{
        //Release the connection
        connection.release();
    
        if(!err){
            pool.getConnection((err,connection)=>{
                if(err) throw err; // throws error if NotConnected
                console.log('Connected as ID '+ connection.threadId);
            
            
            //Connecting the query
            connection.query('SELECT * FROM User WHERE id = ?',[req.params.id],(err,rows)=>{
                //Release the connection
                connection.release();
            
                if(!err){
                    res.render('edit-user',{rows,message:`${firstname} has been Updated`});
                }else{
                    console.log(err);
                }
                console.log('The Data from user Table : \n ',rows);
            })
            })
        }else{
            console.log(err);
        }
        console.log('The Data from user Table : \n ',rows);
    })
    })
    }
    exports.delete =(req,res)=>{

pool.getConnection((err,connection)=>{
    if(err) throw err; // throws error if NotConnected
    console.log('Connected as ID '+ connection.threadId);


//Connecting the query
connection.query('DELETE FROM User WHERE id = ?',[req.params.id],(err,rows)=>{
    //When we click DELETE button on webpage this DELETE function is triggered and removes data from the Database
    //Release the connection
    connection.release();

    if(!err){
        res.redirect('/');
    }else{
        console.log(err);
    }
    console.log('The Data from user Table : \n ',rows);
})
})
    }

    exports.viewUser=(req,res)=>{
        pool.getConnection((err,connection)=>{
            if(err) throw err;
            console.log('Connected as ID'+connection.threadId);
            //Query the connection
            connection.query('SELECT * FROM User WHERE id = ?',[req.params.id],(req,rows)=>{
                //when Done With The connection ; Release it!
                connection.release();
                if(!err){
                    res.render('view-user',{rows});
                }
                else{
                    console.log(err);
                }

            })
        })

    }