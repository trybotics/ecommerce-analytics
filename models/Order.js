var mongoose = require('mongoose')
var Schema = mongoose.Schema
var autoIncrement = require('mongoose-auto-increment')

const OrderSchema = new Schema({
    id: {
        type:Number,
        require:true,
        unique:true,
        ref: 'id'
    },
    created:{
        type:Date,
    },
    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    products: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }, 
        quantity: Number, 
        amount: Number,
    }],
    amount: Number
},{collection: 'Order',timestamps:true})

autoIncrement.initialize(mongoose.connection)
OrderSchema.plugin(autoIncrement.plugin, { model: 'Order', field: 'id',startAt:1,incrementBy:1})
var Order = mongoose.model('Order',OrderSchema)
module.exports = Order
