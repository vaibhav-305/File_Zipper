import express from 'express';
import { HuffmanEncoding } from "./Huffman_Coding/huff_encoding.js";
import { HuffmanDecoding } from './huffman_Coding/huff_decoding.js';
//const fileUpload = require("express-fileupload");
const port = process.env.PORT || 3000;

const app = express();
app.use(express.static("public"))
app.set('view engine', 'ejs');


app.use(express.json());
//app.use(fileUpload());         //for files


app.get('/',(req,res)=>{
    res.render("home");
})

app.post('/encode',(req,res)=>{
    //console.log('ayoo');
    //console.log(req.body);
    try{
        let inputData =req.body.text;
        //console.log(inputData.length);
        const encoding = new HuffmanEncoding()
        let outputData =  encoding.encode(inputData);
        res.status(200).json({outputData});
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

app.post('/decode',(req,res)=>{
    //console.log('ayoo2');
    //console.log(req.body);
    try{
    let inputData =req.body.text;
    //console.log(inputData.length);
    const decoding = new HuffmanDecoding()
    let outputData =  decoding.decode(inputData);
    res.status(200).json({outputData});
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})
/*app.post('/encode',(req,res)=>{
    console.log("Hii");
    if (!req.files) {
        console.log('This aint boo');
        return;
    }
    console.log(req.files);
    const inputFile = req.files.inpFile;
    console.log(inputFile);
    const data = inputFile.data.toString('utf8');
    console.log(data);
    console.log(data.length);
});*/
app.listen(port,function(){
    console.log(`Server started on port ${port}`);
});
