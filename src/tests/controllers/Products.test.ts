import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {app, jwtToken, products} from '../setup';

chai.use(chaiHttp);

const expect = chai.expect;

describe('produits can list items', () => {
  it('should list existing products in the database', async () => {
    const res = await chai.request(app).get('/products/').set('Authorization', jwtToken);
    expect(res).to.be.json;
    expect(res.body).to.have.length.above(0);
    expect(res.body).to.have.length(products.length);
  });
});
