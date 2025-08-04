import { Client} from "pg";
import express from "express";

const app =express();

app.use(express.json());

//const pgClient2 = new Client('postgresql://neondb_owner:npg_z0HGWeXyTCt8@ep-square-shadow-aefqjpx4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

const pgClient2=new Client({
    user:"neondb_owner",
    password:"npg_z0HGWeXyTCt8",
    port:5432,
    host:"ep-square-shadow-aefqjpx4-pooler.c-2.us-east-2.aws.neon.tech",
    database:"neondb",
    ssl: true


})
pgClient2.connect()



// async function main(){

//     await pgClient2.connect();
//     const response = await pgClient2.query("Select * from users");
//     console.log("Connected to the database");
//     const response2 = await pgClient2.query("UPDATE users SET username='rohit' WHERE id=2");
//     console.log(response.rows);
//     await pgClient2.end();
//     console.log("Connection closed");
// }

// main();

app.post("/signup", async(req, res)=>{
    const username=req.body.username;
    const password=req.body.password;
    const email=req.body.email;

    const city=req.body.city;
    const country=req.body.country;
    const street=req.body.street;
    const pincode=req.body.pincode;
try{
    // const insertQuery= `INSERT INTO users (username ,email,password) VALUES ('${username}','${email}','${password}'')`;
    // this leads to SQL injection vulnerability, use parameterized queries instead
    // await pgClient2.query(insertQuery); example of SQL injection vulnerability:  user send badguy', 'bad@evil.com', 'hack'); DROP TABLE users; --


    //we use this to prevent SQL injection
    const insertQuery = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id`;
    const addressInsertQuery = `INSERT INTO addresses (city,country,street,pincode,user_id) VALUES ($1,$2,$3,$4,$5)`;

    pgClient2.query("BEGIN;") // STart transaction
    const response=await pgClient2.query(insertQuery, [username, email, password]);
    const userId=response.rows[0].id;
    const responseaddressQuery=await pgClient2.query(addressInsertQuery, [city,country,street,pincode,userId]);
    pgClient2.query("COMMIT;") // Commit transaction

    res.json({
        message:"User signed up successfully",
    })

} catch(e){
    res.json({
        message:"Error signing up user",
    })
}
})

app.listen(3000);