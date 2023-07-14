const supertest = require('supertest');
const app = require('../app.js');
const { sequelize } = require('../models/index.js')

// 통합 테스트(Integration Test)를 진행하기에 앞서 Sequelize에 연결된 모든 테이블의 데이터를 삭제합니다.
//  단, NODE_ENV가 test 환경으로 설정되어있는 경우에만 데이터를 삭제합니다.
beforeAll(async () => {
    if (process.env.NODE_ENV === 'test') await sequelize.sync();
    else throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');
});

//! 테스트 코드
describe('Items Domain Integration Test', () => {

    //! GET /api/items API의 검증 로직 (데이터 생성 전)
    test('GET /api/items API Integration Test Success Case, Not Found Items Data', async () => {
        const response = await supertest(app)
            .get(`/api/items`) // API의 HTTP Method & URL
            .query({}) // Request Query String
            .send({}); // Request Body

        // 1. API를 호출하였을 때, 성공적으로 실행할 경우 200 Http Status Code를 반환한다.
        expect(response.status).toEqual(200);

        // 2. API의 Response는 아무런 데이터를 삽입하지 않은 상태이므로 { data: [] }의 형태를 가진다.
        expect(response.body).toEqual({ data: [] });
    });

    //! POST /api/items API의 성공 케이스 검증 로직 **/
    test('POST /api/items API, Integration Test Success Case', async () => {
        // Items /api/items API에서 사용되는 body 데이터입니다.
        const createItemRequestBodyParams = {
            itemName: 'itemName',
            explanation: 'explanation',
            price: 999,
            imageUrl: 'imageUrl',
        };

        const response = await supertest(app)
            .post(`/api/items`) // API의 HTTP Method & URL
            .query({}) // Request Query String
            .send(createItemRequestBodyParams); // Request Body


        // 1. API를 호출하였을 때, 성공적으로 실행할 경우 201 Http Status Code를 반환한다.
        expect(response.status).toEqual(201);

        // 2-1. API의 Response는 { data: createPostData }의 형식을 가집니다.
        // 2-2. 여기서 createPostData는 { postId, nickname, title, content, createdAt, updatedAt }의 객체 형태를 가집니다.
        expect(response.body).toMatchObject({ message: "상품 생성에 성공하였습니다" });
    });


    //! POST /api/items API의 에러 케이스 검증 로직 **/
    test('POST /api/posts API, Integration Test Error Case, Invalid Params Error', async () => {
        // POST /api/posts API에서 에러를 발생시키기 위해 사용되는 body 데이터입니다.
        const createPostRequestBodyParamsByInvalidParamsError = {
            itemName: 'itemName_InvalidParamsError',
            explanation: 'explanation_InvalidParamsError',
        };

        const response = await supertest(app)
            .post(`/api/items`) // API의 HTTP Method & URL
            .query({}) // Request Query String
            .send(createPostRequestBodyParamsByInvalidParamsError); // Request Body


        // 1. API를 호출하였을 때, InvalidParamsError가 발생하여 400 Http Status Code를 반환합니다.
        expect(response.status).toEqual(400);

        // 2. API의 Response는 { errorMessage: "InvalidParamsError" }의 형식을 가집니다.
        expect(response.body).toMatchObject({ errorMessage: "상품 생성에 실패하였습니다." });
    });

    //! GET /api/items API의 검증 로직 (데이터 생성 후)
    test('GET /api/items API, Integration Test Success Case, is Exist Posts Data', async () => {
        // GET /api/posts API에서 사용되는 body 데이터입니다.
        const createPostRequestBodyParams = {
            itemName: 'itemName',
            explanation: 'explanation',
            price: 'price',
            imageUrl: 'imageUrl',
        };

        const response = await supertest(app)
            .get(`/api/items`) // API의 HTTP Method & URL
            .query({}) // Request Query String
            .send({}); // Request Body

        /** GET /api/posts API의 검증 로직 **/
        // 1. API를 호출하였을 때, 성공적으로 실행할 경우 200 Http Status Code를 반환한다.
        // 2. API의 Response는 1개의 데이터를 생성한 상태이므로 { data: [ { postId, nickname, title, createdAt, updatedAt }] }의 형태를 가진다.

        // 1. API를 호출하였을 때, 성공적으로 실행할 경우 200 Http Status Code를 반환한다.
        expect(response.status).toEqual(200);

        // 2. API의 Response는 1개의 데이터를 생성한 상태이므로 { data: [ { postId, nickname, title, createdAt, updatedAt }] }의 형태를 가진다.
        expect(response.body).toMatchObject({
            data: [
                {
                    itemId: 1,
                    itemName: createPostRequestBodyParams.itemName,
                    imageUrl: createPostRequestBodyParams.imageUrl,
                },
            ],
        });
    });

    // //! GET /api/items/1 API의 검증 로직 (상세 조회)
    // test('GET /api/items API, Integration Test Success Case, is Exist Item Data', async () => {
    //     // GET /api/posts API에서 사용되는 body 데이터입니다.
    //     const createPostRequestBodyParams = {
    //         itemId: 1,
    //         itemName: 'itemName',
    //         explanation: 'explanation',
    //         price: 999,
    //         imageUrl: 'imageUrl',
    //     }

    //     const response = await supertest(app)
    //         .get(`/api/items/1`) // API의 HTTP Method & URL
    //         .query({}) // Request Query String
    //         .send({}); // Request Body

    //     /** GET /api/posts API의 검증 로직 **/
    //     // 1. API를 호출하였을 때, 성공적으로 실행할 경우 200 Http Status Code를 반환한다.
    //     // 2. API의 Response는 1개의 데이터를 생성한 상태이므로 { data: [ { postId, nickname, title, createdAt, updatedAt }] }의 형태를 가진다.

    //     // 1. API를 호출하였을 때, 성공적으로 실행할 경우 200 Http Status Code를 반환한다.
    //     expect(response.status).toEqual(200);

    //     // 2. API의 Response는 1개의 데이터를 생성한 상태이므로 { data: [ { postId, nickname, title, createdAt, updatedAt }] }의 형태를 가진다.
    //     expect(response.body).toMatchObject({
    //         data: [
    //             {
    //                 itemId: createPostRequestBodyParams.itemId,
    //                 itemName: createPostRequestBodyParams.itemName,
    //                 explanation: createPostRequestBodyParams.explanation,
    //                 price: createPostRequestBodyParams.price,
    //                 imageUrl: createPostRequestBodyParams.imageUrl,
    //             },
    //         ],
    //     });
    // });
});

afterAll(async () => {
    // 통합 테스트가 완료되었을 경우 sequelize의 연결된 테이블들의 정보를 초기화합니다.
    if (process.env.NODE_ENV === 'test') await sequelize.sync({ force: true });
    else throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');
});