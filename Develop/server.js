const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const PORT = 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));




app.get('/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    res.sendFile(path.join(__dirname, '/public/' + fileName + '.html'));
});
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/db/db.json'));
});
app.post('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return
        }
        try {
            let newNote = req.body;
            console.log(newNote);
            let notes = JSON.parse(data);
            newNote.id = notes.length;
            notes.forEach((obj, ind) => {
                obj.id = ind;
            });
            notes.push(newNote);
            console.log(notes);
            const notesString = JSON.stringify(notes)

            fs.writeFile(path.join(__dirname, '/db/db.json'), notesString, (err) => {
                if (err) {
                    console.log("error writing notes")
                } else {
                    console.log("success writing notes")
                }
            })
            res.json(newNote);
        } catch (err) {
            console.log("error parsing notes")
        }
    })

});

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;

    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return
        } else {
            let notes = JSON.parse(data);
            let noteReturn = notes.slice(parseInt(id),parseInt(id)+1);
            console.log(noteReturn)
            notes.splice(parseInt(id), 1);
            notes.forEach((obj, ind) => {
                obj.id = ind;
            });

            console.log(notes);
            let noteString = JSON.stringify(notes);
            fs.writeFile(path.join(__dirname, '/db/db.json'), noteString, (err) => {
                if (err) {
                    console.log("error writing notes")
                } else {
                    console.log("success writing notes")
                }
            })
            res.send(noteReturn);
        }
        
    })
    
});


app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});



app.listen(PORT, () => {
    console.log("listening on port " + PORT)
});