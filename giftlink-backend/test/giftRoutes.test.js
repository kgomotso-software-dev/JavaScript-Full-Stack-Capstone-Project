const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const app = require("../app"); 

describe("GET /gifts", () => {
  it("should return an array of gifts", async () => {
    const res = await request(app).get("/gifts");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });
});