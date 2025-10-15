import pool from "./pool.js";

async function createCategoryTable() {
  try {
    await pool.query(`CREATE TABLE categories(
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      category TEXT,
      imgbucket TEXT,
      imgkey TEXT
    )`);
    console.log("success");
  } catch(err) {
    console.error(err);
    console.log("failed");
  }
}

async function addCategory(name, imgBucket, imgKey) {
  try {
    await pool.query(`INSERT INTO categories (category, imgbucket, imgkey)
      VALUES ($1, $2, $3)`, [name, imgBucket, imgKey]);
    console.log("Image added to database");
  } catch(err) {
    console.error(err);
    console.log("failed to add image to database");
  }
}

async function getAllCategories() {
  try {
    const result = await pool.query(`
      SELECT category, imgbucket, imgkey FROM categories;
    `);
    console.log("categories fetched from db");
    return result.rows;
  } catch(err) {
    console.error(err);
    console.log("failed to fetch categories from db");
  }
}

export { addCategory, getAllCategories };