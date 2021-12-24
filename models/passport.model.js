const localStrategy=require('passport-local').Strategy
const githubStrategy=require('passport-github').Strategy
const googleStrategy=require('passport-google-oauth20').Strategy
const userModel=require('./user.model')
const bcrypt= require('bcrypt')
const passport= require('passport')

module.exports=function(passsport){
    passport.serializeUser(function(users,done){
        // console.log(users.id)
        done(null,users.id)
    })
    passport.deserializeUser(async(id,done)=>{
        try{
            // console.log(id)
            const user=await userModel.findById(id)
            return done(null,user) 
        }
        catch(e){
            done(e)
        }
    })
    passport.use(new localStrategy(
        { 
            usernameField:'email',
            passwordField:'password'

        },
        async function(email,password,done){
            const user = await userModel.findOne({'email':email})
            // console.log(user)
            if(!user){
                return done(null,false,{message: " No user with that email"})
            }
            try{
                if(await bcrypt.compare(password,user.password)){
                    console.log("Login successfully")
                    return done(null,user, {message:"Login successfully"})
                }
                return done(null,false,{message:"Password incorrect"})
            }
        catch(e){
            done(e)
        }
        }
    ))
    passport.use(new githubStrategy({
        clientID: "bee3d5c8a3e67ed2bcea",
        clientSecret: "56d0570573ca6faf38ee1f17df5779ad446e085e",
        callbackURL: "http://localhost:3000/user/github/callback"
      },
      async function(accessToken, refreshToken, profile, done) {
       console.log(profile)
       try {
           const user=await userModel.findOne({email:profile._json.email})
           if(user) return done(null,user)
           const newUser=new userModel({
               name:profile._json.login,
               email:profile._json.url,
               password:"" 
           }) 
           await newUser.save()
           return done(null, newUser)
        } catch (e) {
           console.log(e)
           return done(e)
       }

      }
    ))
    passport.use(new googleStrategy({
        clientID:"820445425999-4nsul73vtu1j58ivpku552h69v9fv922.apps.googleusercontent.com",
        clientSecret:"3TNibNIEEjfjdq3-bBo_z72U",
        callbackURL:"http://localhost:3000/user/google/callback"
    },
    async function(accessToken,refreshToken,profile,done){
        try{
            const user=await userModel.findOne({email:profile._json.email})
            if(user) return done(null,user)
            const newUser=new userModel({
                id:profile._json.sub,
                name:profile._json.name,
                email:profile._json.email,
                pasword:""
            })
            await newUser.save()
            return done(null, newUser)
        }catch(e){
            console.log(e)
            return done(e)
        }
        
    }
))
}