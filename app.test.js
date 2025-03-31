const request = require('supertest');
const app = require('./app');


describe('ClimbHub API Tests', () => {
    /* === CRAG ENDPOINT TESTS === */
    
    describe('Crag Search Endpoint', () => {
        test('GET /crags/search returns 200 status', () => {
            return request(app)
                .get('/crags/search?search_term=alms')
                .expect(200);
        });
        
        test('GET /crags/search returns JSON content type', () => {
            return request(app)
                .get('/crags/search?search_term=alms')
                .expect('Content-type', /json/);
        });
        
        test('GET /crags/search returns matching crags', () => {
            return request(app)
                .get('/crags/search?search_term=alms')
                .expect(response => {
                    expect(response.body.length).toBe(1);
                    expect(response.body[0].name).toBe('Almscliff Crag');
                });
        });
        
        test('GET /crags/search with empty term returns all crags', () => {
            return request(app)
                .get('/crags/search?search_term=')
                .expect(response => {
                    expect(response.body.length).toBe(6);
                });
        });
    });
    
    describe('Crag Details Endpoint', () => {
        test('GET /crags/:name returns 200 for valid crag', () => {
            return request(app)
                .get('/crags/Almscliff%20Crag')
                .expect(200);
        });
        
        test('GET /crags/:name returns JSON content type', () => {
            return request(app)
                .get('/crags/Almscliff%20Crag')
                .expect('Content-type', /json/);
        });
        
        test('GET /crags/:name returns correct crag details', () => {
            return request(app)
                .get('/crags/Almscliff%20Crag')
                .expect(response => {
                    expect(response.body.name).toBe('Almscliff Crag');
                    expect(response.body.location).toBe('North Yorkshire');
                });
        });
        
        test('GET /crags/:name returns 404 for non-existent crag', () => {
            return request(app)
                .get('/crags/NonExistentCrag')
                .expect(404);
        });
    });
    
    /* === ROUTES ENDPOINT TESTS === */
    
    describe('Routes Search Endpoint', () => {
        test('GET /routes/search returns 200 status', () => {
            return request(app)
                .get('/routes/search?search_term=wall&crag_name=Almscliff%20Crag')
                .expect(200);
        });
        
        test('GET /routes/search returns JSON content type', () => {
            return request(app)
                .get('/routes/search?search_term=wall&crag_name=Almscliff%20Crag')
                .expect('Content-type', /json/);
        });
        
        test('GET /routes/search returns matching routes', () => {
            return request(app)
                .get('/routes/search?search_term=wall&crag_name=Almscliff%20Crag')
                .expect(response => {
                    expect(response.body.length).toBe(3);
                    expect(response.body[0].name).toBe("Morrell's Wall");
                    expect(response.body[1].name).toBe("Morrell's Wall Traverse");
                    expect(response.body[2].name).toBe("End Wall");
                });
        });
        
        test('GET /routes/search with empty term returns all routes for crag', () => {
            return request(app)
                .get('/routes/search?search_term=&crag_name=Almscliff%20Crag')
                .expect(response => {
                    expect(response.body.length).toBe(16);
                });
        });
        
        test('GET /routes/search with non-existent crag returns empty array', () => {
            return request(app)
                .get('/routes/search?search_term=&crag_name=NonExistentCrag')
                .expect(response => {
                    expect(response.body.length).toBe(0);
                });
        });
    });
    
    describe('Routes by Grade Endpoint', () => {
        test('GET /routes/bygrade returns 200 status', () => {
            return request(app)
                .get('/routes/bygrade?grade=6A&crag_name=Almscliff%20Crag')
                .expect(200);
        });
        
        test('GET /routes/bygrade returns JSON content type', () => {
            return request(app)
                .get('/routes/bygrade?grade=6A&crag_name=Almscliff%20Crag')
                .expect('Content-type', /json/);
        });
        
        test('GET /routes/bygrade returns routes matching grade', () => {
            return request(app)
                .get('/routes/bygrade?grade=6A&crag_name=Almscliff%20Crag')
                .expect(response => {
                    expect(response.body.length).toBe(3);
                    expect(response.body[0].name).toBe("Morrell's Wall");
                    expect(response.body[0].grade).toBe("6A");
                });
        });
        
        test('GET /routes/bygrade with non-existent grade returns empty array', () => {
            return request(app)
                .get('/routes/bygrade?grade=9Z&crag_name=Almscliff%20Crag')
                .expect(response => {
                    expect(response.body.length).toBe(0);
                });
        });
    });
    
    describe('Routes Grades Endpoint', () => {
        test('GET /routes/grades/:crag returns 200 status', () => {
            return request(app)
                .get('/routes/grades/Almscliff%20Crag')
                .expect(200);
        });
        
        test('GET /routes/grades/:crag returns JSON content type', () => {
            return request(app)
                .get('/routes/grades/Almscliff%20Crag')
                .expect('Content-type', /json/);
        });
        
        test('GET /routes/grades/:crag returns unique grades for crag', () => {
            return request(app)
                .get('/routes/grades/Almscliff%20Crag')
                .expect(response => {
                    expect(response.body.length).toBe(10);
                    expect(response.body).toContain("4");
                    expect(response.body).toContain("6A");
                });
        });
        
        test('GET /routes/grades/:crag with non-existent crag returns empty array', () => {
            return request(app)
                .get('/routes/grades/NonExistentCrag')
                .expect(response => {
                    expect(response.body.length).toBe(0);
                });
        });
    });
    
    describe('Route Details Endpoint', () => {
        test('GET /routes/details/:crag/:routeName returns 200 for valid route', () => {
            return request(app)
                .get('/routes/details/Almscliff%20Crag/Morrell%27s%20Wall')
                .expect(200);
        });
        
        test('GET /routes/details/:crag/:routeName returns JSON content type', () => {
            return request(app)
                .get('/routes/details/Almscliff%20Crag/Morrell%27s%20Wall')
                .expect('Content-type', /json/);
        });
        
        test('GET /routes/details/:crag/:routeName returns correct route details', () => {
            return request(app)
                .get('/routes/details/Almscliff%20Crag/Morrell%27s%20Wall')
                .expect(response => {
                    expect(response.body.crag).toBe('Almscliff Crag');
                    expect(response.body.name).toBe("Morrell's Wall");
                    expect(response.body.grade).toBe("6A");
                });
        });
        
        test('GET /routes/details/:crag/:routeName returns 404 for non-existent route', () => {
            return request(app)
                .get('/routes/details/Almscliff%20Crag/NonExistentRoute')
                .expect(404);
        });
    });
    
    /* === ADD ROUTE ENDPOINT TESTS === */
    
    describe('Add Route Endpoint', () => {        
        test('POST /routes/add fails with invalid crag', () => {
            const params = {
                'crag': 'Invalid Crag',
                'route_name': 'Test_Route',
                'grade': '7A'
            };
            
            return request(app)
                .post('/routes/add')
                .send(params)
                .expect(400);
        });
        
        test('POST /routes/add fails with invalid grade format', () => {
            const params = {
                'crag': 'Almscliff Crag',
                'name': 'Test_Route',
                'grade': 'Invalid-Grade'
            };
            
            return request(app)
                .post('/routes/add')
                .send(params)
                .expect(400);
        });
        
        test('POST /routes/add fails with missing fields', () => {
            const params = {
                'crag': 'Almscliff Crag',
                'grade': '7A'
                // Missing route_name
            };
            
            return request(app)
                .post('/routes/add')
                .send(params)
                .expect(400);
        });
    });
    
    /* === STATIC CONTENT TESTS === */
    
    describe('Static Content', () => {
        test('GET /index.html returns HTML content type', () => {
            return request(app)
                .get('/index.html')
                .expect('Content-type', /html/);
        });
        
        test('GET / returns the index.html file', () => {
            return request(app)
                .get('/')
                .expect('Content-type', /html/);
        });
        
        test('GET /nonexistent-file returns 404', () => {
            return request(app)
                .get('/nonexistent-file.html')
                .expect(404);
        });
    });
});