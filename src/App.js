import React, { PureComponent } from 'react';
import {
  ResponsiveContainer, ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

import axios from 'axios';

const apiPath = "http://localhost:8080"

class App extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      orders: [
        {
            "_id": {
                "day": 13
            },
            "orderCount": 2,
            "productCount": 3,
            "productQuantity": 6,
            "amount": 3200
        },
        {
            "_id": {
                "day": 7
            },
            "orderCount": 1,
            "productCount": 2,
            "productQuantity": 5,
            "amount": 2700
        },
        {
            "_id": {
                "day": 18
            },
            "orderCount": 1,
            "productCount": 1,
            "productQuantity": 4,
            "amount": 2000
        },
        {
            "_id": {
                "day": 25
            },
            "orderCount": 3,
            "productCount": 4,
            "productQuantity": 9,
            "amount": 4900
        },
        {
            "_id": {
                "day": 15
            },
            "orderCount": 1,
            "productCount": 1,
            "productQuantity": 5,
            "amount": 3000
        }
    ],
      customers: [
        {
          "_id": "5f351f05a194f93730f50763",
          "name": "karan",
          "email": "karan.shaw9888@gmail.com",
          "orderCount": 6,
          "productCount": 9,
          "productQuantity": 22,
          "amount": 11600
        },
        {
          "_id": "5f351f3ea194f93730f50769",
          "name": "karan1",
          "email": "karan1@gmail.com",
          "orderCount": 2,
          "productCount": 2,
          "productQuantity": 7,
          "amount": 4200
        },
        {
          "_id": "5f351f3ea194f93730f5076a",
          "name": "karan2",
          "email": "karan2@gmail.com",
          "orderCount": 0,
          "productCount": 0,
          "productQuantity": 0,
          "amount": 0
        }
      ]
    }
  }
  componentDidMount() {
    // this.getCustomer()
    // this.getOrder()
  }

  getCustomer = () => {
    axios.get(apiPath + '/customer')
      .then(response => {
        this.setState({ customers: response.data })
      })
      .catch(error => {
        console.log("error", error)
      })
  }

  getOrder = () => {
    axios.get(apiPath + '/order')
      .then(response => {
        this.setState({ orders: response.data })
      })
      .catch(error => {
        console.log("error", error)
      })
  }

  render() {
    return (
      <div>
        <style>
          {`
         .chart{
           width: 50%;
           margin-top: 50px;
         }
         @media screen and (max-width: 660px) {
          .chart{
            width: 100%;
          }
        }
         `}
        </style>
        <div className="chart" style={{ height: 400, float: 'left' }}>
          <center><h4>Day Wise Chart</h4></center>
          <ResponsiveContainer>
            <ComposedChart
              width={500}
              height={400}
              data={this.state.orders.map(data => {
                return { ...data, day: data._id.day }
              })}
              margin={{
                top: 20, right: 20, bottom: 20, left: 20,
              }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{ value: 'Order, Product, Quantity', angle: -90, dx: -10 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'Amount', angle: 90, dx: 30 }} />
              <Tooltip />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="orderCount" fill="#8884d8" stroke="#8884d8" />
              <Line yAxisId="left" type="monotone" dataKey="productCount" stroke="#413ea0" />
              <Line yAxisId="left" type="monotone" dataKey="productQuantity" stroke="#ff7300" />
              <Bar yAxisId="right" dataKey="amount" barSize={20} fill="#82ca9d" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="chart" style={{ height: 400, float: 'right' }}>
          <center><h4>Customer Wise Chart</h4></center>
          <ResponsiveContainer>
            <ComposedChart
              width={500}
              height={400}
              data={this.state.customers}
              margin={{
                top: 20, right: 20, bottom: 20, left: 20,
              }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{ value: 'Order, Product, Quantity', angle: -90, dx: -10 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'Amount', angle: 90, dx: 30 }} />
              <Tooltip />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="orderCount" fill="#8884d8" stroke="#8884d8" />
              <Line yAxisId="left" type="monotone" dataKey="productCount" stroke="#413ea0" />
              <Line yAxisId="left" type="monotone" dataKey="productQuantity" stroke="#ff7300" />
              <Bar yAxisId="right" dataKey="amount" barSize={20} fill="#82ca9d" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}

export default App;
