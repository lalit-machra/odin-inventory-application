import { uploadImg, getImageUrl } from "../storage/s3operations.js";
import { addPart, getStdPartImg, getAllPartsByCategoryId } from "../db/partsQuery.js";
import { getCategoryId } from "../db/categoriesQuery.js";

async function populateParts(part, price, imgFileName, imgFileBuffer, imgFileMime, category) {
  try {
    const bucketName = 'inventory-parts-480';
    let categoryId = await getCategoryId(category);
    if (categoryId) {
      if (!imgFileName) {  // no image uploaded, need to fetch standard image
        imgFileName = await getStdPartImg();
      } else {
        await uploadImg(bucketName, imgFileName, imgFileBuffer, imgFileMime);
      }
      await addPart(part, price, bucketName, imgFileName, categoryId);
      console.log("added to parts successfully");
    } else {
      throw new Error("No such category exists");
    }
  } catch(err) {
    console.error(err);
    console.log("couldn't add to parts");
  }
}

async function getParts(req, res) {
  let rawPartCategory = req.params.part;
  // Capitalize each word
  let partCategory = rawPartCategory.split('-').map(word => word.substr(0, 1).toUpperCase() + word.substr(1)).join(" ");
  let categoryId = await getCategoryId(partCategory);

  let parts = [];
  let addNew = {};  // send addNew as separate parameter to view.ejs and display it at last
  addNew.name = "Add New";
  addNew.image = await getImageUrl("inventory-category-480", "add-new.png");

  if (categoryId) {
    let allParts = await getAllPartsByCategoryId(categoryId);
    // Wait for allParts.forEach to finish before moving ahead
    let asyncIterator = new Promise((resolve, reject) => {
      if (allParts.length !== 0) {
        allParts.forEach(async (part, index, arr) => {
          let partObj = {};
          partObj.name = part.part;
          partObj.price = part.price;
        
          let imgBucket = part.imgbucket;
          let imgKey = part.imgkey;
          partObj.image = await getImageUrl(imgBucket, imgKey);
          
          parts.push(partObj);
          
          if (index === arr.length - 1) {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
    asyncIterator.then(() => {
      res.render("parts", { title: partCategory, rawPartCategory, parts: parts, addNew: addNew });
    });
  } else {
    console.log("Couldn't load the part");
    res.end();
  }
}

async function postParts(req, res) {
  let rawPartCategory = req.params.part;
  let partCategory = rawPartCategory.split('-').map(word => word.substr(0, 1).toUpperCase() + word.substr(1)).join(" ");

  let part = req.body.partName;
  let price = req.body.partPrice;
  if (req.files) {
    let imgBuffer = req.files.partImg.data;
    let mime = req.files.partImg.mimetype;
    let imgFileType = mime.slice(mime.indexOf("/") + 1);
    let imgFileName = part.toLowerCase().replaceAll(" ", "-") + "." + imgFileType;
    await populateParts(part, price, imgFileName, imgBuffer, mime, partCategory);
  } else {
    await populateParts(part, price, null, null, null, partCategory);
  }
  res.redirect("/parts/" + rawPartCategory);
}

export { getParts, postParts };