const express = require('express');
const router = express.Router();
const { calcShares } = require('../utils/inheritance');
const Case = require('../models/Case');

router.post('/calc', (req, res) => {
  try {
    const input = req.body;
    const out = calcShares(input);
    return res.json(out);
  } catch (err) { return res.status(500).json({error: err.message}); }
});

router.post('/cases', async (req,res)=>{
  try{
    const input = req.body;
    const out = calcShares(input);
    const c = await Case.create({ estateAmount: input.estate, debts: input.debts, willFraction: input.willFraction, ignoreWillLimit: input.ignoreWillLimit, heirs: input.counts, result: out });
    res.json({id: c._id, result: out});
  }catch(err){res.status(500).json({error: err.message});}
});

router.get('/cases/:id', async (req,res)=>{
  try{
    const c = await Case.findById(req.params.id);
    if(!c) return res.status(404).json({error:'not found'});
    res.json(c);
  }catch(err){res.status(500).json({error: err.message});}
});

module.exports = router;
