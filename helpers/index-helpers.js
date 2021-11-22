var db=require('../config/connection')
var objectId = require('mongodb').ObjectID

module.exports = {
    
    addpdf:(data,callback)=>{
        var ID
        db.get().collection('csigecb').insertOne(data, (err)=>{
            if (err) return;
            ID = data._id;
            ID = ID.toString();
            callback(ID)
        })
    },
    getAllCSIreports:()=>{
        return new Promise(async(resolve,reject)=>{
            let datas =await db.get().collection('csigecb').find().toArray()
            resolve(datas)
        })
    },
    addpdftkm:(data,callback)=>{
        var ID
        db.get().collection('csitkm').insertOne(data, (err)=>{
            if (err) return;
            ID = data._id;
            ID = ID.toString();
            callback(ID)
        })
    },
    getAllTKMreports:()=>{
        return new Promise(async(resolve,reject)=>{
            let datas =await db.get().collection('csitkm').find().toArray()
            console.log(datas);
            resolve(datas)
        })
    },
    deleteGECBReport:(ID)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('csigecb').remove({_id:objectId(ID)}).then((response)=>{
                resolve(response);
                x = 'rejected'
                reject(response)
            })
        })
        
    },

    deleteTKMReport:(ID)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('csitkm').remove({_id:objectId(ID)}).then((response)=>{
                resolve(response);
                x = 'rejected'
                reject(response)
            })
        })
        
    },
    
}