const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const http = require('http')
const moment = require('moment')

app.use(cors())
app.use(bodyParser.json({ limit: '500mb' }))
app.use(bodyParser.urlencoded({ limit: '500mb', extended: false }))
app.use(express.static(path.join(__dirname, 'build')))

// Server Connection
const port = process.env.PORT || '8080'
app.set('port', port)
const server = http.createServer(app)
console.log('NODE TIME ===> ' + moment(new Date()).format("YYYY-MM-DD HH:mm:ss"))
server.listen(port, () => console.log(`API running on localhost:${port}`))

// DataBase Connection
var mongoose = require('mongoose')
// Production DB
mongoose.connect("mongodb://root:root1234@ds145009.mlab.com:45009/revtap")

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () { console.log("we are connected!") })

// import model
var Order = require('./models/Order')
var Customer = require('./models/Customer')
var Product = require('./models/Product')

// API
app.get('/customer', function (req, res) {
    Customer.aggregate([{
        "$lookup": {
            "from": "Order",
            "localField": "_id",
            "foreignField": "customer",
            "as": "orders",
        }
    },
    {
        "$project": {
            "name": "$name",
            "email": "$email",
            "orderCount": { "$size": "$orders" },
            "productCount": {
                "$sum": {
                    "$map": {
                        "input": "$orders",
                        "as": "order",
                        "in": { "$sum": { "$size": "$$order.products" } }
                    }
                }
            },
            "productQuantity": {
                "$sum": {
                    "$map": {
                        "input": "$orders",
                        "as": "order",
                        "in": {
                            "$sum":
                            {
                                "$map": {
                                    "input": "$$order.products",
                                    "as": "product",
                                    "in": "$$product.quantity"
                                }
                            }
                        }
                    }
                }
            },
            "amount": { "$sum": "$orders.amount" },
        }
    }
    ], function (err, customer) {
        if (err) throw err;
        res.json(customer)
    })
})

app.get('/order', function (req, res) {
    Order.aggregate([
        {
            "$group": {
                "_id": { "day": { "$dayOfMonth": "$created" } },
                "orderCount": { "$sum": 1 },
                "productCount": { "$sum": { "$size": "$products" } },
                "productQuantity": {
                    "$sum": {
                        "$sum": {
                            "$map": {
                                "input": "$products",
                                "as": "product",
                                "in": "$$product.quantity"
                            }
                        }
                    }
                },
                "amount": { "$sum": "$amount" }
            },
        },
        {
            "$replaceRoot": {
                "newRoot": {
                    "day": "$_id.day",
                    "orderCount": "$orderCount",
                    "productCount": "$productCount",
                    "productQuantity": "$productQuantity",
                    "amount": "$amount"
                }
            }
        },
        {
            "$group": {
                "_id": null,
                "orders": { "$push": "$$ROOT" }
            }
        },
        {
            "$project": {
                "orders": {
                    "$map": {
                        "input": { "$range": [1, 32] },
                        "as": "date",
                        "in": {
                            "$let": {
                                "vars": { "dateIndex": { "$indexOfArray": ["$orders.day", "$$date"] } },
                                "in": {
                                    "$cond": {
                                        "if": { "$ne": ["$$dateIndex", -1] },
                                        "then": { "$arrayElemAt": ["$orders", "$$dateIndex"] },
                                        "else": {
                                            "day": "$$date",
                                            "orderCount": 0,
                                            "productCount": 0,
                                            "productQuantity": 0,
                                            "amount": 0
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            "$unwind": "$orders"
        },
        {
            "$replaceRoot": {
                "newRoot": "$orders"
            }
        },
        {
            "$sort": {
                "day": 1
            }
        }
    ], function (err, orders) {
        if (err) throw err;
        // let ordersData = orders.map(order => {
        //     order.day = order._id.day
        //     delete order._id
        //     return { ...order }
        // })
        // ordersData = Array.from({ length: 31 }, (value, index) => {
        //     return {
        //         day: index + 1,
        //         orderCount: 0,
        //         productCount: 0,
        //         productQuantity: 0,
        //         amount: 0
        //     }
        // }).map(data => {
        //     let index = ordersData.findIndex((order, i) => {
        //         return order.day == data.day
        //     })
        //     return index != -1 ? ordersData[index] : data
        // })
        res.json(orders)
    })
})