import express from "express";

import req from "express/lib/request.js";

import { count } from "console";
import { nextTick } from "process";
import 'dotenv/config';
import authMiddleware from "./middlewares/auth.middleware.js";

import res from "express/lib/response.js";
import fs from "fs"
import logMiddleware from "./middlewares/auth.middleware.js";
import { query } from "express";

import axios from "axios";

const port = process.env.PORT
const app = express()
app.use(express.json())



app.get('/', async(req, res) => {
const options = {
method: 'post',
url: 'https://its.dbdevelopment.tech/notes',
headers: {
 'token': "l298vk-816529-wco"
},
data: {
  "user": "@MarcoAstolfi"
 }
};

try{
 const result = await axios.request(options)
 const notes = result.data;
 const dataJSON = JSON.stringify(notes.data)
 fs.writeFileSync('database/githubnotes.json', dataJSON)
 } catch (error){
    console.error('ERRORE: ', error);
}
res.send('Pagina Principale')
})

app.get('/api/notes', authMiddleware, (req, res) => {
    const dataFile = fs.readFileSync('database/githubnotes.json', 'utf8')
    const notes = JSON.parse(dataFile)
    const {data} = req.query
    let noteData = notes
    let noteLimit = [...notes]
    const {limit} = req.query
   
if(!limit && !data){
 res.status(200).json({
 "succes": true,
 "list": true,
 "data": notes
})

} else if(!limit && data){
noteData = noteData.filter(note => new Date(note.date) > new Date(data)) 
res.status(200).json({
"succes": true,
"data": noteData,
"filtered": true
})

} else (!data && limit)
 noteLimit = noteLimit.slice(0, Number(limit))
  res.status(200).json({
  "succes": true,
  "data": noteLimit
})
    

})
  
  app.get('/api/notes/:id', (req, res) => {
    const dataFile = fs.readFileSync('database/githubnotes.json', 'utf8')
    const {id} = req.params
    const notes = JSON.parse(dataFile)
    const noteById = notes.find((note) => note.id === id)
res
 .status(200)
 .contentType('application/json')
 .json({
  "success": true,
  "single": true,
  "data": noteById
    })
})

app.post('/api/notes', authMiddleware, (req, res) => {
const dataFile = fs.readFileSync('database/githubnotes.json', 'utf8')
const note = req.body
const notes = JSON.parse(dataFile)
notes.push(note)
res.status(201).json({
   "success": true,
   "data": note
})
  
})
  app.put('api/notes/:id', authMiddleware, (req, res) => {
    const dataFile = fs.readFileSync('database/githubnotes.json', 'utf8')
    const title = req.body.title
    const notes = JSON.parse(dataFile)
    const body = req.body.body
    const{id} = req.params


res.status(200).json({
 "succes": true,
 "title": title,
 "body": body
 })
})

app.listen(port || 3000) 
  
//Molte delle cose richieste non funzionano ma ho provato comunque ad abbozzare qualcosa anche con l'aiuto di internet e compagni di classe