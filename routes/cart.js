const express=require('express')
const productModel=require('../models/product.model')
const cartModel=require('../models/cart.model')
const orderModel=require('../models/order.model')
const router=express.Router()

function check(req,res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/user/login')
}
router.get('/',async(req,res)=>{
    try{
        // req.session.cart=null
        let cart=[] 
        let total=0
        if(req.session.cart){
            cart=req.session.cart.items
            total=req.session.cart.priceTotal
        }
        res.render('carts/cart',{cart:cart, total:total})
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})

router.get('/add/:id',async(req,res)=>{
    try{
        const product=await productModel.findById(req.params.id)
        const cart=new cartModel(req.session.cart ? req.session.cart: {items:[]})
        cart.add(product,req.params.id, product.imageSrc)
        req.session.cart=cart
        res.redirect('/cart')
    }catch(e){
        console.log(e.message)
        res.redirect('/')
    }
    
})
router.delete('/:id',async(req,res)=>{
    try{
        const id=req.params.id
        const cart=new cartModel(req.session.cart)
        cart.delete(id)
        req.session.cart=cart
        // req.send("Delete Successfully")
        res.redirect('/cart')
    }catch(e){
        // req.send("Delete Failed")
        console.log(e.message)
        res.redirect('/')
    }
    
})

router.get('/checkout',check,(req,res)=>{
    if(!req.session.cart)
    {
        res.redirect('/')
    }
    const cart= new cartModel(req.session.cart)
    const total = new Intl.NumberFormat().format(cart.priceTotal)
    res.render('carts/checkout',{products:cart.items,total:total})
})

router.post('/order',async(req,res)=>{
    try{
        const cart=new cartModel(req.session.cart)
        const order=new orderModel({
            user:req.user,
            cart:cart,
            address:req.body.address
        })
        req.session.cart=null
        req.flash("success","Order successfully")
        console.log(order)
        await order.save()
        res.redirect('/')
    }
    catch(e){
        console.log(e)
        res.redirect('/cart/checkout')
    }
})

// router.get('/pay',(req,res)=>{
//     const create_payment_json={
//         "intent": "sale",
//             "payer": {
//                 "payment_method": "credit_card",
//                 "funding_instruments": [{
//                     "credit_card": {
//                         "type": "visa",
//                         "number": "4417119669820331",
//                         "expire_month": "11",
//                         "expire_year": "2018",
//                         "cvv2": "874"
//                     }
//                 }]
//             },
//             "transactions": [{
//                 "amount": {
//                     "total": "7",
//                     "currency": "USD",
//                     "details": {
//                         "subtotal": "5",
//                         "tax": "1",
//                         "shipping": "1"
//                     }
//                 },
//                 "description": "This is the payment transaction descriptiön."
//             }]
//     }
//     paypal.payments.create(create_payment_json,function(error,payment){
//         if(error){
//             throw error;
//         }
//         else{
//             console.log("Create Payment Response")
//             console.log(payment)
//             res.send("thanh cong")
//         }
//     })
// })
router.put('/reduce/:id',(req,res) => {
    try{
        const id=req.params.id
        const cart =new cartModel(req.session.cart)
        cart.reduce(id)
        req.session.cart=cart
        // req.send("Update Successfully")
        res.redirect('/cart')
    }catch(e){
        // req.send("Update Failed")
        console.log(e)
        res.redirect('/')
    }
})
router.put('/increase/:id',(req,res) => {
    try{
        const id= req.params.id
        const cart =new cartModel(req.session.cart)
        cart.increase(id)
        req.session.cart=cart
        // req.send("Update Successfully")
        res.redirect('/cart')
    }catch(e){
        // req.send("Update Failed")
        console.log(e)
        res.redirect('/')
    }
})


module.exports=router