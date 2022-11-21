const {MongoMemoryServer} = require("mongodb-memory-server");
const {MongoClient} = require("mongodb");
const walletRepository = require("../../src/wallet/wallet.repository");

jest.mock("../../src/wallet/wallet.repository");

describe('Wallet.Repository', () =>{
    let mongoServer, mongoClient , db;
    const collectionName = 'wallet';


    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        mongoClient = await MongoClient.connect(mongoServer.getUri(), {});
    });

    afterAll(async() => {
        if (mongoClient) {
            await mongoClient.close();
        }
        if (mongoServer) {
            await mongoServer.stop();
        }
    });

    describe('Create Wallet', () => {

        it('should create wallet successfully', async ()=>{
            // Given
            const newData = {
                customerId: 'abc123',
                balance: 50000,
            };
            // When
            const result = walletRepository.create(newData)
            // Then
            expect(result).toBeTruthy();
        });
    });

});