var mongoose=require('mongoose'),
	Schema = mongoose.Schema;

	//String, number,date, buffer,boolean
	
	mongoose.connect("mongodb://localhost/primera_tabla");
	var regular=[/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i, "Pon un email correcto"];
	var validation_pass= {
					validator:function(p){
						return this.password_confirmation == p;
					}, message:"No son iguales"};

	//Database Schema and validations
	var user_Schema = new Schema({
		name:{type:String, required:"El nombre es requerido"},
		lastname:String,
		password:{type:String, required:true, minlength:[5, "contraseña muy corta"],
				validate:validation_pass},
		email:{type:String, match:regular}
	});

	//Creating virtuals to validations
	user_Schema.virtual('password_confirmation').get(function(){
		return this.p_c;
	}).set(function(password){
			this.p_c=password;

		});


	//Creating the collection model with name and schema
	var User= mongoose.model("User", user_Schema);


	module.exports.User=User;

