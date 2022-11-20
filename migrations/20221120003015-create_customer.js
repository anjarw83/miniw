module.exports = {
  async up(db, client) {
    const collectionName = 'customers'

    await db.createCollection(collectionName)
  },

  async down(db, client) {
    // Don't Delete Collection
  }
};
