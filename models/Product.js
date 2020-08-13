var mongoose = require('mongoose')
var Schema = mongoose.Schema
var autoIncrement = require('mongoose-auto-increment')

const ProductSchema = new Schema({
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
    created:{
        type:Date,
    },
    price: Number
},{collection: 'Product',timestamps:true})

autoIncrement.initialize(mongoose.connection)
ProductSchema.plugin(autoIncrement.plugin, { model: 'Product', field: 'id',startAt:1,incrementBy:1})
var Product = mongoose.model('Product',ProductSchema)
module.exports = Product
