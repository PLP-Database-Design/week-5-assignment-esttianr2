const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');

app.use(express.json());
app.use(cors());
dotenv.config();


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//checking connection

db.connect((err)=>{
    if(err) return console.log('error connecting to database');

    console.log("connection successful id:", db.threadId);


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//1. Retrieve all patients

app.get('/patients', (req, res)=> {
    //retrieve data from the database
    db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results)=>{
        if (err){
            console.error('Database query error: ',err);
            res.status(500).send('Error retrieving data');
        }
        else{
            //display the records
            res.render('patients', {results: results});
        }
    });
});

// 2. Retrieve all providers
//i created different routes to avoid conflicting

app.get('/providers', (req, res)=> {
    //retrieve data from the database
    db.query('SELECT provider_id, first_name, last_name, provider_specialty FROM providers', (err, results)=>{
        if (err){
            console.error('Database query error: ',err);
            res.status(500).send('Error retrieving data');
        }
        else{
            //display the records
            res.render('providers', {results: results});
        }
    });
});

// 3. Filter patients by First Name

app.get('/firstname', (req, res)=>{
    db.query( 'SELECT first_name,patient_id,  last_name FROM patients ORDER BY first_name ', (err, results)=>{
        if (err){
            console.log('Database query error:', err);
            res.status(500).send('Error retrieving data');
        }
        else{
            res.render('firstname',{results: results});
        }
    })
})




//4. Retrieve all providers by their specialty

app.get('/specialty', (req, res)=>{
    db.query('SELECT provider_id, first_name, last_name, provider_specialty FROM providers ORDER BY provider_specialty',(err, results)=>{
        if (err){
            console.log('Database query error', err);
            res.status(500).send('Error retrieving data');
        }
        else{
            res.render('specialty', {results, results});
        }
    })
})




    app.listen(process.env.PORT, ()=>{
        console.log(`server listening on port ${process.env.PORT}`);

//TEST the browser

        console.log('testing browser');
        app.get('/', (req, res) => {
            res.send('server started successfully')
        })

    });
});