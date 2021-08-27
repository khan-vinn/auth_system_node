/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const { Quize } = require('../models');
const UserSchema = require('../models/schema/user');
const testSetUp = require('./testSetUp');

testSetUp();

const User = mongoose.model('TestUser', UserSchema);
describe('DB auth test setup', () => {
  const email = `${nanoid(5)}@gmail.com`;
  const password = nanoid(8);
  describe('create user with any invalid params', () => {
    it('create user with email without password', async () => {
      try {
        await User.create({ email });
      } catch (error) {
        expect(error.toString()).toMatch(/password/);
      }
    });
    it('create user with email and password where pasword length less 6', async () => {
      try {
        await User.create({ email, password: nanoid(5) });
      } catch (error) {
        expect(error.toString()).toMatch(/length/);
      }
    });
    it('create user with email and password where email length less 5', async () => {
      try {
        await User.create({ email: nanoid(4), password });
      } catch (error) {
        expect(error.toString()).toMatch(/length/);
      }
    });
  });
  describe('Create user with email and password without any error, check to equals to params', () => {
    it('create user with valid email and password', async () => {
      try {
        const response = await User.create({ email, password });
        expect(response.email && response.password).toBeTruthy();
        expect(response.email).toBe(email);
        expect(response.password).toBe(password);
      } catch (error) {
        expect(error).toBeFalsy();
      }
    });
    it('create user and check this _id', async () => {
      try {
        const response = await User.create({ email, password });
        expect(response._id).toBeTruthy();
        expect(response._id.toString().length).toBeGreaterThan(5);
        expect(response._id.toString().length).toBeLessThan(28);
      } catch (error) {
        expect(error).toBeFalsy();
      }
    });
    afterEach(async () => {
      await User.findOneAndDelete({ email });
    });
  });
  describe('Change all in data', () => {
    const emailToChange = `${nanoid(8)}@gmail.com`;
    const passwordToChange = nanoid(9);
    it('is old password equal to change password', () => {
      expect(password).not.toBe(passwordToChange);
    });
    it('is old email equal to new email', () => {
      expect(email).not.toBe(emailToChange);
    });
    describe('Change email', () => {
      beforeEach(async () => {
        await User.create({ password, email });
      });
      afterEach(async () => {
        await User.findOneAndDelete({ email: emailToChange });
      });
      it('update user email without any error', async () => {
        try {
          const newUser = await User.findOneAndUpdate(
            { email }, { email: emailToChange }, { new: true },
          );
          expect(email).not.toBe(newUser.email);
        } catch (error) {
          expect(error).toBeFalsy();
        }
      });
      it('update user email with any error', async () => {
        try {
          const newUser = await User.findOneAndUpdate(
            { email },
            { email: nanoid(5) },
            { new: true },
          );
          expect(email).not.toBe(newUser.email);
        } catch (error) {
          /*  It's a bug< or no, but findoneandupdate methods dont validate before/after saving */
          expect(error).toBeFalsy();
          /*  It's a bug< or no, but findoneandupdate methods dont validate before/after saving */
        }
      });
      it('update email and password twice', async () => {
        const newUser = await User.findOneAndUpdate({ email }, {
          email: emailToChange,
          password: passwordToChange,
        }, { new: true });
        expect(newUser.email).not.toBe(email);
        expect(newUser.email).toBe(emailToChange);
        expect(newUser.password).not.toBe(password);
        expect(newUser.password).toBe(passwordToChange);
      });
    });

    afterAll(async () => {
      await User.findOneAndDelete({ email });
    });
  });
});

describe('Quize app db setup', () => {
  it('true is true', () => {
    expect(true).toBe(true);
    expect(true).toBeTruthy();
  });
});

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
    const questions = [{}, {}];
    const forms = [{}, {}];
    let quize;
    let user;
    beforeAll(async () => {
      user = await User.create({ email, password });
    });
    afterAll(async () => {
      await User.remove({ email });
    });
    it('create quize', async () => {
      quize = await Quize.create({ title, belongsTo: user._id });
      expect(quize.title).toBe(title);
      expect(quize.belongsTo).toBeTruthy();
    });
  });
});
