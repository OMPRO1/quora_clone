const express = require('express');
const app = express();
const path = require('path');
const { v4: uuidv4 } = require('uuid');
let methodOverride = require('method-override');
const { default: mongoose } = require('mongoose');


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride('_method'));


let port = 3000;

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/college");
}

main().
then(() => {
    console.log("DB Connetcted successful");
})
.catch((err) => {
    console.log(err);
});

const postSchema = mongoose.Schema({

});

const Post = new mongoose.model("Post",postSchema);

let posts = [
    {
        id:uuidv4(),
        username:"Ruturaj",
        content : "I love Acting"
    },
    {
        id:uuidv4(),
        username:"Amrut",
        content : "I love Gym"
    },
    {
        id:uuidv4(),
        username:"Sveri",
        content : "I am noob"
    }
];

app.listen(port, () => {
    console.log("App listening on port :",port);
});

app.get("/posts", (req,res) => {
    
    res.render("index.ejs",{posts});
});

app.get("/posts/new", (req,res) => {

    res.render("new.ejs");
});

app.post("/posts", (req,res) => {
   
    let {username , content } = req.body;
    let id = uuidv4();
    posts.push({id,username,content});
    res.redirect("/posts");
});

app.get("/posts/:id", (req,res) => {
    let {id} = req.params;
    let post = posts.find((p) => id == p.id);
    // console.log(post);
    res.render("show.ejs",{post});
});

app.patch("/posts/:id", (req,res) => {
    let newContent = req.body.content;
    let {id} = req.params;
    let post = posts.find((p) => id == p.id);
    post.content = newContent;
    // res.send("patch working");
    res.redirect("/posts");
});

app.get("/posts/:id/edit", (req,res) => {
    let {id} = req.params;
    let post = posts.find((p) => id == p.id);
    res.render("edit.ejs",{post});
});

app.delete("/posts/:id", (req,res) => {
    let {id} = req.params;
    posts = posts.filter((p) => id != p.id);
    res.redirect("/posts");
});