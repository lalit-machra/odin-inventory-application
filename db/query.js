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

async function addPart(name, price, imgbucket, imgkey, categoryId) {
  try {
    await pool.query(`
      INSERT INTO parts(part, price, imgbucket, imgkey, category_id)
      VALUES ($1, $2, $3, $4, $5);
    `, [name, price, imgbucket, imgkey, categoryId]);
    console.log("entry added to parts table");
  } catch(err) {
    console.error(err);
    console.log("Couldn't add entry to parts table");
  }
}

async function getStdPartImg() {
  try {
    const result = await pool.query(`
      SELECT imgkey FROM parts WHERE part LIKE 'Standard Part';
    `);
    console.log("Fetched standard part image info");
    return result.rows[0].imgkey;
  } catch(err) {
    console.error(err);
    console.log("Couldn't get standard part image info");
  }
}

async function getAllPartsByCategoryId(categoryId) {
  try {
    const result = await pool.query(`
      SELECT parts.part, parts.price, parts.imgbucket, parts.imgkey, categories.category
      FROM parts JOIN categories ON category_id = categories.id
      WHERE category_id = $1;
    `, [categoryId]);
    console.log("Part fetched from db");
    return result.rows;
  } catch(err) {
    console.error(err);
    console.log("failed to fetch part from db");
  }
}

export { addCategory, getAllCategories, getCategoryId, addPart, getStdPartImg, getAllPartsByCategoryId };