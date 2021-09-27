var express1 =require("express")
const fast2sms = require('fast-two-sms');
const https = require("https");
const qs = require("querystring");
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

var register =require('./models/register');
var comment=require('./models/comment');
// var addproperty=require('./models/addproperty');
 const checksum_lib = require("./Paytm/checksum");
const config = require("./Paytm/config");
var path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

var bodyParser =  require("body-parser")
var methodOverride = require('method-override')
var mongoose       =  require("mongoose")

// mongoose.connect("mongodb+srv://sahil:abcd@cluster0.fxjpt.mongodb.net/sahil?retryWrites=true&w=majority")
mongoose.connect("mongodb+srv://sahil:abcd@cluster0.ouo1v.mongodb.net/sahil?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>console.log('db connected'));
app = express1();



const parseUrl = express1.urlencoded({ extended: false });
const parseJson = express1.json({ extended: false });


app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express1.static("uploads"));
app.use(express1.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));


app.use(express1.urlencoded({ extended: false }))
// app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
var fs = require('fs'); 
var path = require('path');
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json()) 
var multer = require('multer');


app.get("/",function(req,res){
    res.render("home");
  });
app.get("/keyboard",function(req,res){
res.render("keyboard");
});
app.get("/med",function(req,res){
    res.render("med");
    });
app.get('/login', (req, res) => {
    res.render('login.ejs', { messages: '' })
    })
app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = await register.find({email});
    console.log(user);
    if(user.length == 0) return res.render('login.ejs', { messages: 'User not found' });
    const pwd = await bcrypt.compare(password, user[0].password);
    console.log(pwd);
    if(pwd) {
        return res.redirect('/');
    }
    return res.render('login.ejs', { messages: 'Password Invalid' });
    
    });
    app.get('/signup',  (req, res) => {
        res.render('signup.ejs')
      })
      
app.post('/signup', async (req, res) => {
try {
const hashedPassword = await bcrypt.hash(req.body.password, 10)
var register1=new register({
    username: req.body.name,
    email: req.body.email,
    password:hashedPassword
    
});
console.log(register1);
register1.save(function(err,registers){
    if(err)
    {
        console.log("something went wrong")
        console.log(err);
    }
    else{
        console.log("data saved")
        console.log(registers);
    }
})

const otp = Math.floor(100000 + Math.random() * 900000);
      console.log(otp);
   

      //  await fast2sms.sendMessage({ authorization: 'yCVxSZp5rQaD6wRgBW4Us98dXYM1qvlzeOkntiPmILT0jJfocEk6vVA7d2NnBOqL0PMeDl8FmzxE1fCj' , message: `Your Villado OTP is ${otp}`, numbers: ['9896103092']});
    res.render('otp',{otp:otp})
// res.redirect('/login')
} catch {
res.redirect('/signup')
}
})
app.post('/otp', function(req,res){ 

  console.log(req.body);
  //console.log((req.body.n1*100000)+(req.body.n2*10000)+(req.body.n3*1000)+(req.body.n4*100)+(req.body.n5*10)+(req.body.n6*1));
  var pp=(req.body.n1*100000)+(req.body.n2*10000)+(req.body.n3*1000)+(req.body.n4*100)+(req.body.n5*10)+(req.body.n6*1);
  console.log(pp);
  if(pp==req.body.abcd)
  res.redirect('/login');
  else
  res.redirect('/signup');  
});
// app.get('/otp', async (req, res) => {
//     const otp = Math.floor(100000 + Math.random() * 900000);
//       console.log(otp);
//       await fast2sms.sendMessage({ authorization: 'yCVxSZp5rQaD6wRgBW4Us98dXYM1qvlzeOkntiPmILT0jJfocEk6vVA7d2NnBOqL0PMeDl8FmzxE1fCj' , message: `Your Villado OTP is ${otp}`, numbers: ['8802063746']});
//     res.render('otp',{otp:otp})

//   })
app.get("/review",function(req,res){
  comment.find().exec(function(err,camp){
    //console.log(camp);
     res.render("review",{ comment :camp});
   });
  });
  app.get("/reviewajax",function(req,res){
    comment.find().exec(function(err,camp){
      //console.log(camp);
       res.send({ comment :camp});
     });
    });
app.post("/review",function(req,res){
  //console.log(req.body);
  var comment1= new comment({
      user:req.body.comment.username,
      text:req.body.comment.review
    });
     //onsole.log(comment1);
  comment1.save(function(err,com){
      if(err)
        {
            console.log("something went wrong")
            console.log(err);
        }
        else{
            console.log("data saved")
            //console.log(com);
            //res.redirect("/newap1/5f782a2fab220f3484e622ac");
        }
    })
})
  app.get("/pay", (req, res) => {
    res.render("pay");
  });
  app.post("/paynow", [parseUrl, parseJson], (req, res) => {
    // Route for making payment
  
    var paymentDetails = {
      amount: req.body.amount,
      customerId: req.body.name,
      customerEmail: req.body.email,
      customerPhone: req.body.phone
  }
  if(!paymentDetails.amount || !paymentDetails.customerId || !paymentDetails.customerEmail || !paymentDetails.customerPhone) {
      res.status(400).send('Payment failed')
  } else {
      var params = {};
      params['MID'] = config.PaytmConfig.mid;
      params['WEBSITE'] = config.PaytmConfig.website;
      params['CHANNEL_ID'] = 'WEB';
      params['INDUSTRY_TYPE_ID'] = 'Retail';
      params['ORDER_ID'] = 'TEST_'  + new Date().getTime();
      params['CUST_ID'] = paymentDetails.customerId;
      params['TXN_AMOUNT'] = paymentDetails.amount;
      params['CALLBACK_URL'] = 'http://localhost:3000/callback';
      params['EMAIL'] = paymentDetails.customerEmail;
      params['MOBILE_NO'] = paymentDetails.customerPhone;
  
  
      checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
          var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
          // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production
  
          var form_fields = "";
          for (var x in params) {
              form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
          }
          form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";
  
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
          res.end();
      });
  }
  });
  app.post("/callback", (req, res) => {
    // Route for verifiying payment
  
    var body = '';
  
    req.on('data', function (data) {
       body += data;
    });
  
     req.on('end', function () {
       var html = "";
       var post_data = qs.parse(body);
  
       // received params in callback
       console.log('Callback Response: ', post_data, "\n");
  
  
       // verify the checksum
       var checksumhash = post_data.CHECKSUMHASH;
       // delete post_data.CHECKSUMHASH;
       var result = checksum_lib.verifychecksum(post_data, config.PaytmConfig.key, checksumhash);
       console.log("Checksum Result => ", result, "\n");
  
  
       // Send Server-to-Server request to verify Order Status
       var params = {"MID": config.PaytmConfig.mid, "ORDERID": post_data.ORDERID};
  
       checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
  
         params.CHECKSUMHASH = checksum;
         post_data = 'JsonData='+JSON.stringify(params);
  
         var options = {
           hostname: 'securegw-stage.paytm.in', // for staging
           // hostname: 'securegw.paytm.in', // for production
           port: 443,
           path: '/merchant-status/getTxnStatus',
           method: 'POST',
           headers: {
             'Content-Type': 'application/x-www-form-urlencoded',
             'Content-Length': post_data.length
           }
         };
  
  
         // Set up the request
         var response = "";
         var post_req = https.request(options, function(post_res) {
           post_res.on('data', function (chunk) {
             response += chunk;
           });
  
           post_res.on('end', function(){
             console.log('S2S Response: ', response, "\n");
  
             var _result = JSON.parse(response);
               if(_result.STATUS == 'TXN_SUCCESS') {
                   res.send('payment sucess')
               }else {
                   res.send('payment failed')
               }
             });
         });
  
         // post the data
         post_req.write(post_data);
         post_req.end();
        });
       });
  });

// chat
  const http = require('http').createServer(app)




app.get('/chat', (req, res) => {
    res.render('chat');
})

// Socket 
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('Connected...')
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })

})
///////////////////////////////////////////////     

  app.listen(3001,function(){
    console.log("server is started");
});