// import express from 'express'
const express = require('express')
const cors = require('cors')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema, graphql} = require('graphql')
const Task = require('./models/Task')
const { text } = require('express')

const tasks = [
    new Task(1, 'Learn NodeJS', 'This is to learn NodeJS.'),
    new Task(2, 'Learn Express', 'This is to learn Express.',true),
    new Task(3, 'Learn GraphQL', 'This is to learn GraphQL.',true),
    new Task(4, 'Learn Apollo', 'This is to learn Apollo.'),
    new Task(5, 'Learn Testing', 'This is to learn Testing.'),
]

const app = express()

app.use(cors())

const schema = buildSchema(`
    type Task{
        id: ID
        title: String
        description: String
        completed: Boolean
        date: String
    }

    type Query{
        tasks: [Task]
        task(id: ID!): Task
    }
`)

const rootValue = {
    tasks() {
        return tasks
    },

    task({id}){
        let task = null
        for (let i in tasks) {
            if (tasks[i].id == id) {
                task = tasks[i]
                break;
            }
        }
        return task
    }
}

app.use('/api',graphqlHTTP({
    schema,
    rootValue,
    graphiql: true
}))

// app.use('/api',graphqlHTTP({
//     schema: buildSchema(`
//         type Alert{
//             color: String
//             text: String
//         }

//         type Query {
//             msg : Alert
//         }
//     `),
//     rootValue: {
//         msg: () => ({color: 'DANGER', text: 'Hello world!'})
//     },
//     graphiql: true
// }))

app.get('/', (req, res) => {
    res.send('<h1>Express Works!</h1>')
})

app.post('/', (req, res) => {
    res.send('<h1>POST Express Works!</h1>')
})

app.get('/tasks', (req, res) => {
    res.send(tasks)
})

app.get('/tasks/:id', (req, res) => {
    const { id } = req.params
    let task = null

    for (let i in tasks) {
        if (tasks[i].id == id) {
            task = tasks[i]
            break;
        }
    }

    res.send(task)
})

app.listen(3001, () => console.log('Server Started!'))