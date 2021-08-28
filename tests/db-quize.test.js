/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */

const { nanoid } = require('nanoid');
const { Quize, User } = require('../models');
const testSetUp = require('./testSetUp');

testSetUp();

describe('testing quize model', () => {
  describe('create new quize, with exists user', () => {
    const email = `${nanoid(9)}@mma.vv`;
    const password = nanoid(9);
    const quizeTitle = `Test - ${Math.ceil(Math.random()) * 1000}`;
    let user;
    beforeAll(async () => {
      user = await User.create({ email, password });
    });
    afterAll(async () => {
      await User.remove({ email });
      await Quize.remove({ title: quizeTitle });
    });
    it('create new quize with title', async () => {
      const response = await Quize.create({ title: quizeTitle, belongsTo: user._id });
      expect(response._id).toBeTruthy();
      expect(response.title).toBe(quizeTitle);
    });
    it('expect for created quize belongs to user', async () => {
      const response = await Quize.findOne({ title: quizeTitle });
      expect(String(response.belongsTo)).toBe(String(user._id));
    });
  });
  describe('create and push to quize questions', () => {
    const title = `Title - test - ${nanoid(9)}`;
    const email = `${nanoid(4)}@gggg.gf`;
    const password = nanoid(7);
    const questions = [
      { question: nanoid(19), answer: nanoid(4), invalidAnswers: [nanoid(4), nanoid(4)] },
      { question: nanoid(19), answer: nanoid(4), invalidAnswers: [nanoid(4), nanoid(4)] },
    ];
    const forms = [{}, {}];
    let user;
    beforeAll(async () => {
      user = await User.create({ email, password });
    });
    afterAll(async () => {
      await User.remove({ email });
    });
    it('create quize', async () => {
      await Quize.create({ title, belongsTo: user._id });
      const quize = await Quize.findOne({ title }).populate('belongsTo');
      expect(quize.title).toBe(title);
      expect(quize.belongsTo).toBeTruthy();
      expect(String(quize.belongsTo._id)).toBe(String(user._id));
    });
    it('insert into quize questions', async () => {
      const response = await Quize.findOneAndUpdate(
        { title },
        { $push: { queries: { $each: questions } } },
        { new: true },
      );
      expect(response).toBeTruthy();
      for (let i = 0; i < response.queries.length; i += 1) {
        expect(response.queries[i].question).toBe(questions[i].question);
        expect(response.queries[i].answer).toBe(questions[i].answer);
        expect(Array.from(response.queries[i].invalidAnswers).length)
          .toBe(questions[i].invalidAnswers.length);
      }
    });
  });
});
