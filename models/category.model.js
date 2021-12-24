const mongoose=require('mongoose')
const productModel=require('./product.model')
const categorySchema=new mongoose.Schema({
    name:{type:String,required:true,default:"Snack"}
})

categorySchema.pre('remove', async function(next){
    try{
        const products=await productModel.find({category:this.id})
        if(products.length>0){
            next(new Error("Không xóa được"))
        }
    }catch(e){
        next()
    }
})

module.exports=mongoose.model('category',categorySchema)