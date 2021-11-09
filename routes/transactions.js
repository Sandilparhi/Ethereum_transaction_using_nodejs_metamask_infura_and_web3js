const express = require('express');
const router = express.Router();
const Web3 = require('web3')
const Trx = require('ethereumjs-tx').Transaction
const mongoose = require('mongoose');
const Transaction = require('../Models/transation');

const web3 = new Web3('https://ropsten.infura.io/v3/projectid')
const privateKey = Buffer.from( 'privateKey', 'hex');


//Get Balance
router.post('/balance', async (req, res, next) => {
    const { account } = req.body;
    try {
        const balance = web3.utils.fromWei(
            await web3.eth.getBalance(account)
        );
        res.status(200).json({
            Status : 'Your account balance is :',
            Account_No : account,
            Account_Bal : balance
        })
    } catch (Error) {
        res.status(404).json({ Status : 'Unable to found your account!' })
        console.log(Error) 
    }
})


//Transaction Send

router.post('/transaction', async (req, res, next) => {
    const { from,  to , value } = req.body;

    try {
        web3.eth.getTransactionCount(from, (err, txCount) => {
    
            // Build the Transaction
            const transactionObj = {
                nonce : web3.utils.toHex(txCount),
                to : to,
                value: web3.utils.toHex(web3.utils.toWei(value, 'ether')),
                gasLimit : web3.utils.toHex(21000),
                gasPrice : web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
            }
        
            //Sign the Transaction
            const trx = new Trx(transactionObj, { chain: 'ropsten' })
            trx.sign(privateKey)
        
            const serializedTransaction =trx.serialize()
            const raw ='0x'+serializedTransaction.toString('hex')
        
             //Broadcast the Transaction
            web3.eth.sendSignedTransaction(raw, (err,txHash) => {
                console.log('err:', err)
                console.log('txHash:', txHash)
               

                //Transaction Object for Save in mongodb
                const trans1 = new Transaction({
                    _id : new mongoose.Types.ObjectId,
                    from : req.body.from,
                    to : req.body.to,
                    value : req.body.value,
                    gasLimit : transactionObj.gasLimit,
                    gasPrice : transactionObj.gasPrice,
                    Hash : txHash
                })
                try {
                    const t1 = trans1.save()
                    res.status(200).json({
                        Status : 'Transaction success',
                        trans1,
                    }) 
                } catch (error) {
                    res.status(404).json({
                        Status :'Unable to trans1 :',
                        error
                    })
                }
            })
        })
    } catch (error) {
        res.send(error)
    }
})

module.exports = router;