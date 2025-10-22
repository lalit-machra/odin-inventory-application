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

async function deleteCategory(name) {
  try {
    await pool.query(`DELETE FROM categories WHERE category = $1`, [name]);
    console.log("Image removed from database");
  } catch(err) {
    console.error(err);
    console.log("failed to remove image from database");
  }
}

async function getAllCategories() {
  try {
    const result = await pool.query(`
      SELECT category, imgbucket, imgkey FROM categories;
    `);
    if (!result.rows) throw new Error("fetched falsy values for categories");
    console.log(result.rows.length);
    console.log("categories fetched from db");
    return result.rows;
  } catch(err) {
    console.error(err);
    console.log("failed to fetch categories from db");
  }
}

async function getCategoryId(category) {
  try {
    const result = await pool.query(`SELECT id FROM categories WHERE category LIKE $1`, [category]);
    return result.rows[0].id;
  } catch(err) {
    console.error(err);
    console.log("Couldn't fetch category ID");
    return null;
  }
}


export { addCategory, deleteCategory, getAllCategories, getCategoryId };