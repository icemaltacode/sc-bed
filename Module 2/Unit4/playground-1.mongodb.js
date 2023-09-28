// Pipeline stages
use('sweetscomplete');
db.purchases.aggregate([
  { $match: { "customer.country": /AU/ }},
  { $group: 
    {
      _id: "$customer.name",
      total: { $sum: "$amount" }    
    }
  }
]);

// Using $bucket
use('sweetscomplete');
db.purchases.aggregate([
  {
    $bucket: {
      groupBy: "$customer.name",
      boundaries: ["A", "G", "M", "S", "Y"],
      default: "Y-Z",
      output: {
        "count": { $sum: 1},
        "names": { $push: "$customer.name" },
        "amounts": { $push: "$amount" }
      }
    }
  },

]);

// Using $group
use('sweetscomplete');
db.purchases.aggregate([
  {
    $group: {
      _id: "$customer.name",
      total: { $sum: "$amount" },
      avgQty: { $avg: "$quantity" },
      count: { $sum: 1 }
    }
  }
]);

// Using $lookup
use('sweetscomplete');
db.purchases.aggregate([
  {
    $lookup: {
      from: 'customers',
      localField: 'customer._id',
      foreignField: '_id',
      as: 'customer_details'
    }
  },
  { $limit: 1 },
  { $project: { _id: 0, customer: 0, "customer_details.password": 0 } }
]);

// Using $match
use('sweetscomplete');
db.purchases.aggregate([
  {
    $match: {
      "customer.country":/UK/,
      "product.title":/chocolate/i
    }
  },
  {
    $group: {
      _id: "$product.title",
      "total": { $sum: "$amount" }
    }
  }
]);

// Using expression operators
use('sweetscomplete');
days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
db.purchases.aggregate([
  {
    $bucket: {
      groupBy: { $dayOfWeek: { $toDate: "$date" } },
      boundaries: [ 1,2,3,4,5,6,7,8 ],
      default: "other",
      output: {
        "dow": { $push: { $dayOfWeek: { $toDate: "$date" } } },
        "amounts": { $push: "$amount"}
      }
    }
  },
  {
    $project: {
      dow: { $min: "$dow" },
      day: { $arrayElemAt: [days, { $subtract: [{ $min:"$dow" }, 1] }] },
      amounts: { $sum: "$amounts" }
    }
  }
]);

// Using mapReduce()
use('sweetscomplete');
db.purchases.mapReduce(
  function() {
    if (this.customer.country == "US") {
      emit( this.customer.state_province, this.amount);
    }
  },
  function(key, values) {
    return Array.sum(values);
  },
  {
    out: "totals_by_us_state"
  }
);
db.totals_by_us_state.find();