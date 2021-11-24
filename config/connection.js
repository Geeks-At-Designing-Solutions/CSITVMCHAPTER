const mongoClient = require('mongodb').MongoClient
const state={
    db:null
}

module.exports.connect=function(done){
    const url = 'mongodb+srv://CSI:xXf5pZpKyBnsVyU@cluster0.ebkpm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    const dbname = 'chapters'
    
    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err)
        state.db=data.db(dbname)
        done()
    })
}   

module.exports.get=function(){
    return state.db
}