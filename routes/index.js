var express = require('express');
const indexHelpers = require('../helpers/index-helpers');
var router = express.Router();
var dateFormat = require("dateformat");

const verifyLogin = (req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CSITVM' });
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/loginreq', (req, res)=>{
  var username = req.body.username;
  var password = req.body.password; 
  switch(username) {
    case 'superadmin':
      if(password=='123'){
        req.session.loggedIn=true
        res.render('superadmin');
      }
      else{
        res.render('login', {'loginErr':true})
      }
      break;
    case 'CSIGECBH':
      if(password=='abc'){
        req.session.loggedIn=true
        res.redirect('/csigecbh');
      }
      else{
        res.render('login', {'loginErr':true})
      }
      
      break;
      case 'SCTCE':
      if(password=='sctce'){
        req.session.loggedIn=true
        res.render('admin');
      }
      else{
        res.render('login', {'loginErr':true})
      }
      
      break;
      case 'TKMCE':
        if(password=='TKMCE'){
          req.session.loggedIn=true
          res.redirect('/csitkm');
        }
        else{
          res.render('login', {'loginErr':true})
        }
        
        break;

    default:
      res.render('login', {'loginErr':true})
  }
 
  
});

/*csigecb*/
router.get('/csigecbh',verifyLogin, function(req, res) {
  indexHelpers.getAllCSIreports().then((data)=>{
    var link = '/add-csigecbh-pdf'
    var logout1 = true;
    var editable = true;
    var i = 1
    data.forEach(element => {
      element.index=i
      element.deleteLink = '/delete-report-gecb/'
      i++;
    });
    console.log(data);
    res.render('admin', {data,link,editable,logout1});
  })
});
router.get('/csigecbh-super',verifyLogin, function(req, res) {
  indexHelpers.getAllCSIreports().then((data)=>{
    var link = '/add-csigecbh-pdf'
    var i = 1
    data.forEach(element => {
      element.index=i
      i++;
    });
    var editable = false;
    var logout1 = true;
    res.render('admin', {data,link,editable,logout1});
  })
});
router.post('/add-csigecbh-pdf',verifyLogin, function(req, res) {
  var data=req.body
  if (req.files) {
    let now = new Date();
    var x = dateFormat(now, 'dddd, mmmm dS, yyyy');
    data.date = x;
    indexHelpers.addpdf(data,(id)=>{
      let reports = req.files.Report
      reports.mv('./public/report/'+id+'.pdf',(err,done)=>{
        if(!err){
          res.redirect('/csigecbh')
        }else{
          
          console.log(err);
        }
      })
     
    })
  }
  else{
      indexHelpers.getAllCSIreports().then((data)=>{
      var link = '/add-csigecbh-pdf'
      var editable = true;
      var logout1 = true;
      var i = 1
      data.forEach(element => {
        element.index=i
        element.deleteLink = '/delete-report-gecb/'
        i++;
      });
      console.log(data);
      res.render('admin', {data,link,editable,logout1,alert:true});
    })
  }

  
});

/*csitkm*/

router.get('/csitkm',verifyLogin, function(req, res) {
  indexHelpers.getAllTKMreports().then((data)=>{
    var link = '/add-csitkm-pdf'
    var editable = true;
    var logout1 = true;
    var i = 1
    data.forEach(element => {
      element.index=i
      element.deleteLink = '/delete-report-tkm/'
      i++;
    });
    console.log(data);
    res.render('admin', {data,link,editable,logout1});
  })
});
router.get('/csitkm-super',verifyLogin, function(req, res) {
  indexHelpers.getAllTKMreports().then((data)=>{
    var link = '/add-csitkm-pdf'
    var editable = false;
    var logout1 = true;
     var i = 1
    data.forEach(element => {
      element.index=i
      i++;
    });
    res.render('admin', {data,link,editable,logout1});
  })
});

router.post('/add-csitkm-pdf',verifyLogin, function(req, res) {
  var data=req.body
  if (req.files) {
    let now = new Date();
    var x = dateFormat(now, 'dddd, mmmm dS, yyyy');
    data.date = x;
    indexHelpers.addpdftkm(data,(id)=>{
      let reports = req.files.Report
      
      reports.mv('./public/report/'+id+'.pdf',(err,done)=>{
        if(!err){
          res.redirect('/csitkm')
        }else{
          
          console.log(err);
        }
      })
     
    })
  }
  else{
    indexHelpers.getAllTKMreports().then((data)=>{
      var link = '/add-csitkm-pdf'
      var editable = true;
      var logout1 = true;
      var i = 1
      data.forEach(element => {
        element.index=i
        element.deleteLink = '/delete-report-tkm/'
        i++;
      });
      console.log(data);
      res.render('admin', {data,link,editable,logout1,alert:true});
    })
  }

  
});
router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/login')
});

router.get('/delete-report-gecb/:id',(req,res)=>{
  let ID=req.params.id;
  indexHelpers.deleteGECBReport(ID).then((response)=>{
    res.redirect('/csigecbh');
  })
});

router.get('/delete-report-tkm/:id',(req,res)=>{
  let ID=req.params.id;
  indexHelpers.deleteTKMReport(ID).then((response)=>{
    res.redirect('/csitkm');
  })
});



module.exports = router;
