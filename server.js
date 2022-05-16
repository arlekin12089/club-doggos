import express from "express";
import { MongoClient, ObjectId} from "mongodb";

const app = express();
const port = 3000;

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true}))
app.use(express.static('public'))

const client = new MongoClient('mongodb://127.0.0.1:27017');
await client.connect();
const db = client.db('doggos');
const usersCollection = db.collection('users');

//pages

app.get('/', (req, res) =>{
	res.render('homepage', {
		title: 'Doggos'
	})
})

app.get('/users/register', (req, res) =>{
	res.render('register', {
		title: 'Register'
	})
})

app.post('/users/register', async (req, res) =>{
	console.log(req.body);
	await usersCollection.insertOne(req.body);
	res.redirect('/users');
})



app.get('/user/:id', async (req, res) =>{
const user = await usersCollection.findOne({ _id: ObjectId(req.params.id)});
console.log(user)
	res.render('user', {
	title: 'User',
	...user})
})


app.get('/users', async (req, res) =>{
	
	//console.log(users);
	let users;
	if(req.query.sortOrder ==='asc'){
		users = await usersCollection.find({}).sort({ 'username': 1}).toArray();

	}else if(req.query.sortOrder ==='desc'){
		users = await usersCollection.find({}).sort({ 'username': -1}).toArray();

	}else{
	if(users===undefined){
	users === [];
	console.log('There are no users');
	}
		users = await usersCollection.find({}).toArray();
	}
	res.render('users', {
		title: 'Users',
		users
	})
})

app.get('/user/delete/:id', async(req, res) =>{
console.log(usersCollection)
	await usersCollection.deleteOne({ _id: ObjectId(req.params.id)});
	res.redirect('/users');
})

app.get('/update/:id', async( req, res)=>{
const user = await usersCollection.findOne({ _id: ObjectId(req.params.id) });
res.render('update', {
 	title:'Edit user',
        ...user
})
})


app.post('/update/:id', async (req, res) => {
  await usersCollection.updateOne({_id:  ObjectId(req.params.id)}, {$set: req.body})
  res.redirect('/users')
})

app.use((req, res) => {
res.status(404).render('404', {
title:'404'
})
})

app.listen(port, () => console.log(`Listening on ${port}`));