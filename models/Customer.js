var mongoose = require('mongoose')
var Schema = mongoose.Schema
var autoIncrement = require('mongoose-auto-increment')

const CustomerSchema = new Schema({
    id: {
	   	type:Number,
	   	require:true,
	   	unique:true,
	   	ref: 'id'
    },
    name:{
        type:String,
        require:true
    },
    email:{
	   	type:String,
		require:false,
	   	unique:true
    },
    created:{
        type:Date,
    },
    
},{collection: 'Customer',timestamps:true})

autoIncrement.initialize(mongoose.connection)
CustomerSchema.plugin(autoIncrement.plugin, { model: 'Customer', field: 'id',startAt:1,incrementBy:1})

var Customer = mongoose.model('Customer',CustomerSchema)
module.exports = Customer
