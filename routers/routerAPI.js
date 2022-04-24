const express = require('express')
const routerAPI = express.Router()

const utilSec = require('../utils/utilSec')

const knex = require('knex')({
    client: 'pg',
    debug: true,
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    }
});

routerAPI.get('/produtos', utilSec.checkToken, (req, res, next) => {
    knex.select('*').from('produto')
        .then(produtos => res.status(200).json(produtos))
        .catch(err => {
            res.status(500).json({
                message: 'Erro ao recuperar produtos - ' + err.message
            })
        })
})

routerAPI.get('/produtos/:id', utilSec.checkToken, (req, res, next) => {
    knex.select('*').from('produto')
        .where({ id: req.params.id })
        .then(produtos => res.status(200).json(produtos))
        .catch(err => {
            res.status(500).json({
                message: 'Erro ao recuperar produto - ' + err.message
            })
        })
})

routerAPI.post('/produtos', utilSec.checkToken, utilSec.isAdmin, (req, res, next) => {
    knex('produto')
        .insert({ descricao: req.body.descricao, valor: req.body.valor, marca: req.body.marca }, ['id'])
        .then(result => {
            res.status(201).json({ message: 'Produto incluído com sucesso.', id: result[0].id })
        }).catch(err => {
            res.status(500).json({
                message: 'Erro ao incluir produto - ' + err.message
            })
        })
})

routerAPI.put('/produtos/:id', utilSec.checkToken, utilSec.isAdmin, (req, res, next) => {
    knex('produto')
        .where({ id: req.params.id })
        .update({ descricao: req.body.descricao, valor: req.body.valor, marca: req.body.marca })
        .then(result => {
            res.status(200).json({ message: 'Produto atualizado com sucesso.' })
        })
        .catch(err => {
            res.status(500).json({
                message: 'Erro ao atualizar produto - ' + err.message
            })
        })
})

routerAPI.delete('/produtos/:id', utilSec.checkToken, utilSec.isAdmin, (req, res, next) => {
    knex('produto')
        .where({ id: req.params.id })
        .del()
        .then(n => {
            if (n) {
                res.status(200).json({ message: 'Produto excluído com sucesso.' })
            } else {
                res.status(404).json({ message: 'Produto não encontrado para exclusão.' })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'Erro ao excluir produto - ' + err.message
            })
        })
})

module.exports = routerAPI