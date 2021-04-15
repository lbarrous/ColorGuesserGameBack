import fse from "fs-extra";
import request from "supertest";
import app from "../app";

fse.outputFile = jest.fn().mockResolvedValue(() => {});

describe("POST /newGame", () => {
  it("should return STATUS 200 & valid response with gameID if maxAttempts is sent [LOCAL]", async () => {
    const data = {
      maxAttempts: 5,
    };
    await request(app)
      .post(`/api/newGame`)
      .send(data)
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect(200);
  });
  it("should return STATUS 300 & error response if maxAttempts is not sent [LOCAL]", async () => {
    await request(app).post(`/api/newGame`).send({}).expect(300);
  });
  it("should return STATUS 300 & error response if maxAttempts is empty", async () => {
    await request(app)
      .post(`/api/newGame`)
      .send({ maxAttempts: "" })
      .expect(300);
  });
});

describe("POST /guess", () => {
  afterAll(() => jest.clearAllMocks());
  it("should return STATUS 200 & valid response with hints and correctColors if gameId and guess is sent properly but combination is not guessed", async () => {
    fse.readFile = jest.fn().mockResolvedValue(
      JSON.stringify({
        gameId: "0adc8107-d097-444e-9406-1378f73e8834",
        combination: ["red", "purple", "blue", "green", "yellow"],
        maxAttempts: 5,
        guesses: 0,
        gameState: "IN_PROGRESS",
      })
    );
    const data = {
      gameId: "0adc8107-d097-444e-9406-1378f73e8834",
      guess: ["blue", "purple", "yellow", "green", "red"],
    };
    await request(app)
      .post(`/api/guess`)
      .send(data)
      .expect("Content-Type", /json/)
      .expect(200)
      .then(async (response) => {
        expect(response.body).toEqual({ hits: 1, correctColors: 2 });
      });
  });

  it("should return STATUS 200 & valid response with WON message is combination is well guessed", async () => {
    fse.readFile = jest.fn().mockResolvedValue(
      JSON.stringify({
        gameId: "0adc8107-d097-444e-9406-1378f73e8834",
        combination: ["red", "purple", "blue", "green", "yellow"],
        maxAttempts: 5,
        guesses: 4,
        gameState: "IN_PROGRESS",
      })
    );
    const data = {
      gameId: "0adc8107-d097-444e-9406-1378f73e8834",
      guess: ["red", "purple", "blue", "green", "yellow"],
    };
    await request(app)
      .post(`/api/guess`)
      .send(data)
      .expect(200)
      .then(async (response) => {
        expect(response.text).toEqual("WON");
      });
  });
  it("should return STATUS 200 & valid response with LOST message is combination is not guessed and it is reached to the last attempt", async () => {
    fse.readFile = jest.fn().mockResolvedValue(
      JSON.stringify({
        gameId: "0adc8107-d097-444e-9406-1378f73e8834",
        combination: ["red", "purple", "blue", "green", "yellow"],
        maxAttempts: 5,
        guesses: 4,
        gameState: "IN_PROGRESS",
      })
    );
    const data = {
      gameId: "0adc8107-d097-444e-9406-1378f73e8834",
      guess: ["blue", "purple", "yellow", "green", "red"],
    };
    await request(app)
      .post(`/api/guess`)
      .send(data)
      .expect(200)
      .then(async (response) => {
        expect(response.text).toEqual("LOST");
      });
  });
});
