import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { app, votes } from '../setup';
import { Vote } from '@entities/Vote';
import { getRepository } from 'typeorm';

chai.use(chaiHttp);

const expect = chai.expect;

describe('VoteController GET', () => {
  it('Should respond with 200', async () => {
    const res = await chai.request(app).get('/votes');
    expect(res).to.have.status(200);
  });

  it('Should return existing votes', async () => {
    const res = await chai.request(app).get('/votes');
    expect(res).to.be.json;
    expect(res.body).to.have.length.above(0);
    expect(res.body).to.have.length(votes.length);
    const dbIds = votes.map(list => list.id);
    const responseIds = res.body.map(list => list.id);
    expect(responseIds).to.have.members(dbIds);
  });
});

describe('VoteController DELETE Then POST', () => {
  it('Should delete the 1 vote', async () => {
    const id = votes[0].id;
    let res = await chai.request(app).delete(`/votes/${id}`);
    expect(res).to.have.status(200);
    res = await chai.request(app).get('/votes/');
    expect(res.body.length).to.be.equal(votes.length - 1);
  });

  it('Should not find the desired vote', async () => {
    const res = await chai.request(app).delete('/votes/1000');
    expect(res).to.have.status(404);
  });
});

describe('VoteController Post', () => {
  it('Should add a vote', async () => {
    const tmp = votes[0];
    const vote = new Vote();

    vote.user = tmp.user;
    vote.promotion = tmp.promotion;
    vote.upvote = false;
    await getRepository(Vote).remove(tmp);
    let res = await chai.request(app).post('/votes/').send(vote);
    expect(res).to.have.status(201);
    res = await chai.request(app).get('/votes/');
    expect(res.body.length).to.be.equal(votes.length);
  });
});
