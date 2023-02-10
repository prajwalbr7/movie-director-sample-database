const express = require("express");
const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "moviesData.db");
app.use(express.json());
let db = null;
const initalizingServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log(`Server Started`);
    });
  } catch (e) {
    console.log(`DB Error${e.message}`);
  }
};
initalizingServer();

const convertingDbObjectToResponseObjectT1 = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
    directorName: dbObject.director_name,
  };
};
///GET
app.get("/movies/", async (request, response) => {
  const gettingAllQueries = `SELECT movie_name FROM movie;`;
  allQueries = await db.all(gettingAllQueries);
  response.send(
    allQueries.map((item) => convertingDbObjectToResponseObjectT1(item))
  );
});
/// POST
app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const insertQuery = `INSERT INTO movie
  (director_id,movie_name,lead_Actor)VALUES
  (
  ${directorId},
  '${movieName}',
  '${leadActor}'
  );`;
  const dbPostResponse = await db.run(insertQuery);
  const movieId = dbPostResponse.lastID;
  response.send("Movie Successfully Added");
});
///GET
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getQuery = `SELECT * FROM movie WHERE movie_id=${movieId};`;
  const getResult = await db.get(getQuery);
  response.send(convertingDbObjectToResponseObjectT1(getResult));
});
///PUT
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const { directorId, movieName, leadActor } = request.body;
  const updateQuery = `UPDATE movie SET director_id=${directorId},
        movie_name='${movieName}',lead_actor='${leadActor}'
        WHERE movie_id=${movieId};`;
  const updatedRes = await db.run(updateQuery);
  response.send(`Movie Details Updated`);
});
///DELETE
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteQuery = `DELETE FROM movie WHERE movie_id=${movieId};`;
  const deleteRes = await db.get(deleteQuery);
  response.send(`Movie Removed`);
});
///GET DIR
app.get("/directors/", async (request, response) => {
  const gettingAllQueries = `SELECT * FROM director;`;
  allQueries = await db.all(gettingAllQueries);
  response.send(
    allQueries.map((item) => convertingDbObjectToResponseObjectT1(item))
  );
});
///GET movie from specific dir
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getMovieDirector = `SELECT movie_name as movieName FROM movie WHERE director_id=${directorId};`;
  const getRes = await db.all(getMovieDirector);
  response.send(getRes);
});
module.exports = app;
