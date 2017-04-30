var express=require('express'),
	bodyparser=require('body-parser'),
	User=require('./models/mong').User,
	cookieSession=require('cookie-session'),
	router_app=require('./routes_app'),
	session_mid=require('./middlewares/session'),
	app=express();
	
	
	//middlewares que se usan para leer parametros 
	app.use(bodyparser.json());
	app.use(bodyparser.urlencoded({extended:true}));
	//middleware que usa para manejo de sesiones en cookies
	app.use(cookieSession({name:"session",
	 keys:["key1", "key2"]
	 
	}));
	//configurar motor de vista (en este caso use .hbs)
	app.set("view engine", "hbs");

	app.get("/",function(req,res){
		User.find(function(err,doc){
			if(!req.session.user_id)
				res.render("index");
			else
				res.redirect("/app");
		

		})
	})



	app.get("/logout", function(req,res){
		req.session=null; //la sesion pasa a estar inactiva
		res.redirect("/");
	})

	app.get("/newUser",function(req,res){ //recibe una peticion get que redirecciona para crear un nuevo perfil
		res.render("newUser");

	})

	app.post("/login",function(req,res){
		User.findOne({email:req.body.email, password:req.body.password}, function(err,docs){		
			if(err)
				console.log("Hubo un error");
			else
				if(docs!=null){
					req.session.user_id=docs._id;
					res.redirect("/app");
				}
				else{
					res.redirect('/');
					console.log("Usuario no encontrado");
				}

		})

	})

	//se reciben parametros para la creacion de un nuevo usuario

	app.post("/create",function(req,res){
		var user = new User({name:req.body.name, lastname:req.body.lastname, password:req.body.password, 
			password_confirmation:req.body.passwordval, email:req.body.email}); //se reciben parametros JSON para crear nuevo usuario
		user.save(function(err){ //Se crea un nuevo usuario con el metodo save de la libreria mongoose
			if(err)
				console.log(String(err));
			res.render("index");

		})
	})
	//Middlewares que controlan la sesion
	app.use("/app", session_mid);
	app.use("/app", router_app);

	app.listen(8080,function(){
		console.log("Listening");
	});

