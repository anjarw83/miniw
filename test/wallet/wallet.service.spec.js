const walletService = require("../../src/wallet/wallet.service");
const {MongoMemoryServer} = require("mongodb-memory-server");
const {MongoClient} = require("mongodb");
const Wallet = require("../../src/wallet/wallet.model");
const Mutation = require("../../src/mutations/mutation.model");

describe('wallet.service', () => {
    let mongoServer, mongoClient , db;
    const collectionName = 'wallet';

    const crateInitialData = async (data) => {
        db = mongoClient.db(mongoServer.instanceInfo.dbName);

        const col = db.collection(collectionName);
        await col.insertMany(data);
    }

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

    describe('Deposits', () =>{

        it('should success', async () => {

            // Given
            const initData = {
                customerId: 'abc123',
                balance: 50000,
                enabled: true,
                createdAt: Date.now(),
            };
            const params = {
                xid: 'abc123',
                amount: 50000,
                reference_id: 'referenceid123'
            }
            const sumData = {
                customerId: 'abc123',
                balance: 100000,
                enabled: true,
                createdAt: Date.now(),
            }
            const mutationData = {
                customerId: params.xid,
                depositId: 'abcdh12345',
                depositedAt: Date.now()
            }

            await crateInitialData([initData]);

            let mockWallet = jest.spyOn(Wallet, 'findOne');
            mockWallet.mockResolvedValueOnce(initData);
            let mockMutation = jest.spyOn(Mutation, 'findOne');
            mockMutation.mockResolvedValueOnce(null);

            mockWallet = jest.spyOn(Wallet, 'findOneAndUpdate');
            mockWallet.mockResolvedValueOnce(sumData);
            mockMutation = jest.spyOn(Mutation, 'create');
            mockMutation.mockResolvedValueOnce(mutationData);

            // When
            const result = await walletService.deposits(params, null);


            // Then
            expect(result.status).toEqual("success");
            expect(result.referenceId).toEqual(params.reference_id);

        });
    })

    describe('Withdrawals', () =>{

        it('should success' , async ()=>{
            // Given
            const initData = {
                customerId: 'abc123',
                balance: 250000,
                enabled: true,
                createdAt: Date.now(),
            };
            const params = {
                xid: 'abc123',
                amount: 50000,
                reference_id: 'referenceid123'
            }
            const updatedData = {
                customerId: 'abc123',
                balance: 200000,
                enabled: true,
                createdAt: Date.now(),
            }
            const mutationData = {
                customerId: params.xid,
                depositId: 'abcdh12345',
                depositedAt: Date.now()
            }

            await crateInitialData([initData]);

            let mockWallet = jest.spyOn(Wallet, 'findOne');
            mockWallet.mockResolvedValueOnce(initData);
            let mockMutation = jest.spyOn(Mutation, 'findOne');
            mockMutation.mockResolvedValueOnce(null);

            mockWallet = jest.spyOn(Wallet, 'findOneAndUpdate');
            mockWallet.mockResolvedValueOnce(updatedData);
            mockMutation = jest.spyOn(Mutation, 'create');
            mockMutation.mockResolvedValueOnce(mutationData);

            // When
            const result = await walletService.deposits(params, null);


            // Then
            expect(result.status).toEqual("success");
            expect(result.referenceId).toEqual(params.reference_id);
        });
    });

});