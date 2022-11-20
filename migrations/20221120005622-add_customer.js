const customerData = require("./data/20221120005622-add_customer")

module.exports = {

  async up(db, client) {
    await db.collection('customers').insert(customerData)
  },

  async down(db, client) {
    await db.collection('customers').findOneAndDelete({email: customerData.email})
  }
};
