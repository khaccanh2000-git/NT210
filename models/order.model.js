const mongoose=require('mongoose')

const orderSchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,req:'user'},
    cart:{type:Object,required:true},
    address:{type:String,required:true}
})
module.exports=mongoose.model('order',orderSchema)