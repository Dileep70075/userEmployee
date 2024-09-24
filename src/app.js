const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path')
const multer = require('multer');
const app = express();
const upload = multer({dest:'uploads/'});
// configure file uploads



// const app = express();
// coonect database
mongoose.connect("mongodb://127.0.0.1:27017/data",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    console.log("Connected success");
})
.catch((err)=>{
    console.error("Error",err);
})
// create modal
const User = mongoose.model('User',{
    name:String,
    email:String,
    image:String,
    managerName:String,
    sts:String,
    date:String
})
app.use(bodyParser.urlencoded({
    extended:true
}))
// getting form
app.get('/',(req,res)=>{
res.sendFile(__dirname+'/Emp.html');
})
// insert date
app.post('/submit',upload.single('image'),(req,res)=>{
    const{name,email,managerName,sts,date} = req.body;
const image = req.file.filename

    const user = new User({
        name,email,image,managerName,sts,date
    });
    user.save().then(()=>{
        res.send('User data is saved');
    })
    .catch((err)=>{
        console.error('Error giving',err);
        res.status(500).send("Error seving user");
    });
});
// show data
app.get('/qwerty',(req,res)=>{
    User.find({}).then(users=>{
        const table = `
        <table>
        <tr>
             <th>AUTHOR</th>
            <th>FUNCTION</th>
            <th>STATUS</th>
            <th>EMPLOYEED</th>
        </tr>
        ${users.map(user=>`
        <tr> 
        <td><img src="/uploads/${user.image}" width="40" height="40"></td>
       
        <td style="margin: 500px;">${user.name}</td>
        <td>${user.email}</td>
       
        
        <td>${user.sts}</td>
        <td>${user.managerName}</td>
        <td>${user.date}</td>
        </tr>
       `).join('')}
            
        </table>`;
        res.send(table)
    })
    .catch((err)=>{
        console.log("error fetching",err);
        res.status(500).send('error');
    });
});










app.use('/uploads',express.static(path.join(__dirname,'uploads')))

const PORT = process.env.PORT || 3006;
app.listen(PORT,()=>{
    console.log(`server is a running on port ${PORT}`);
})
