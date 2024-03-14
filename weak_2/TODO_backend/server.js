import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { now } from "mongoose";

const app=express();
const port=3000;

//mongoose connection srting
mongoose.connect("mongodb+srv://jaideep:Jaideep03@cluster0.udm7ere.mongodb.net/todo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
});

//Schema
const todo=new mongoose.Schema({
    title: String,
    description: String,
    id : Number,
    completed : Boolean
});

// Use a different variable name for the model, e.g., GuideModel
const todoModel = mongoose.model("tasks", todo);

// Place the bodyParser middleware before your routes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())


app.get("/todos",async (req,res)=>{
    try {
        const documents = await todoModel.find({});
        es.status(200).send({documents});
        
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error"); // Handle the error gracefully
      }
})

app.get("/todos/:id", async (req,res)=>{
  try {
    const documents = await todoModel.findOne({"id":req.params.id});
    res.status(200).send({documents});
    
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error"); // Handle the error gracefully
  }
})

let counter = 0;
function generateID() {
  
  counter=counter+1;
  return (counter);
}


app.post("/todos",(req,res)=>{
  // Capture data from the request body
  console.log(req.body);
  const todoData = {
    title: req.body.title,
    completed: false,
    description: req.body.description,
    id:generateID()
    };
  
    // Create a new Guide instance and save it using the model
const todoInstance = new todoModel(todoData); // Use GuideModel here
todoInstance.save();
res.status(201).send({status: "ok"});
})

// app.put("/todos/:id", async (req, res) => {
//   try {
//     const updateData = req.body;
//     const updatedTodo = await todoModel.findByIdAndUpdate(req.params.id, updateData, { new: true });

//     if (!updatedTodo) {
//       return res.status(404).send("Todo not found");
//     }

//     res.status(200).send(updatedTodo);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });


//delete route
app.delete("/todos/:id", async (req, res) => {
  try {
    const result = await todoModel.deleteOne({ id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).send("Todo not found");
    }

    res.status(200).send("Todo deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});






app.listen(port,(err)=>{
    if (err) throw err;
    console.log(`Server running on port ${port}`);
})