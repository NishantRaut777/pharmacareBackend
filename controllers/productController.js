const productModel = require("../models/productModel");

// ADDING PRODUCTS
const addProductController = async(req,res) => {
    try {
        const data = req.body;

        const newProduct = new productModel({
            name: data.name,
            price: data.price,
            imagesrc: data.imagesrc,
            category: data.category
        });

        await newProduct.save()
        .then(() => {
            res.status(200).send({
                message: "Product Added Successfully"
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Something went wrong while adding products",
                error: err
            })
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: `Add Products Controller ERROR ${error}`,
            success: false
        });
    }
};

// GETTING PRODUCTS
const getProductsController = async(req,res) => {
    try {
        const fetchedproducts = await productModel.find();

        res.status(200).send({
            message: "Fetched products successfully",
            fetchedproducts: fetchedproducts,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: `GET Products Controller ERROR ${error}`,
            success: false
        })
    }
};

// GET PRODUCTS BY QUERY
const getProductsByQuery = async(req,res) => {
    try {
        // const category = req.query.category;
        let query;
        if(req.query.category){
            query = { category: req.query.category };
        }

        if(req.query.rating){
            query = { rating : { $gt : parseFloat(req.query.rating) } };
        }

        const filteredProducts = await productModel.find(query);

        res.status(200).send({
            message: "Products filtered successfully",
            filteredProducts: filteredProducts
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: `GET Products By Query Controller ERROR ${error}`,
            success: false
        })
    }
};

// GET PRODUCT BY ID
const getProductById = async(req,res) => {
    try {
        const product = await productModel.findById(req.params.id);
        res.status(200).send(product);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: `GET Products By Id Controller ERROR ${error}`,
            success: false
        });
    }
}


// GET PRODUCT BY NAME
const getProductsByName = async(req, res) => {
    try {
        // const productName = req.params.productName;
        const productName = req.query.searchTerm;
        const products = await productModel.find({  name: {  $regex: productName, $options: "i" } });
        res.status(200).send(products);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: `GET Products By Name Controller ERROR ${error}`,
            success: false
        });
    }
};


const getProductFilters = async(req, res) => {
    try {
        const result = await productModel.aggregate([
            {
              $group: {
                _id: null,
                brands: { $addToSet: "$brand" },
                categories: { $addToSet: "$category" }
              }
            },
            {
              $project: {
                _id: 0,
                brand: "$brands",
                category: "$categories"
              }
            }
          ]);

          let finalCategories = []
          let categoriesSet = new Set();

          for(let category of result[0].category){
            for(let currentCategory of category){
                if(!categoriesSet.has(currentCategory)){
                    finalCategories.push(currentCategory);
                }
            }
          }

          result[0].category = finalCategories;

          res.send(result[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: `getProductFilters Controller ERROR ${error}`,
            success: false
        });
    }
}



const getFilteredProducts = async(req, res) => {
    try {
        const { brands, categories } = req.body;
        let query;

        
         let brandRegex = brands.map(brand => new RegExp(brand, 'i'));
         let categoryRegex = categories.map(category => new RegExp(category, 'i'));

        if(brands.length > 0 && categories.length > 0){
            query = {
                     $and: [
                         { brand: { $in: brandRegex } },
                         { category: { $in: categoryRegex } }
                     ]
                 };
        } else if(brands.length > 0){
            query = 
                { brand: { $in: brandRegex } }
            
        } else if(categories.length > 0){
            query = 
                { category: { $in: categoryRegex } }
        }

        const result = await productModel.find(query);

        res.status(200).send(result);


    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: `getFilteredProducts Controller ERROR ${error}`,
            success: false
        });
    }
}

// Update Product
const updateProductController = async(req,res) => {
    try {
        const updatedProduct = await productModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            {
                new: true
            }
        );

        res.status(200).send({
            message: "Product updated successfully",
            updatedProduct: updatedProduct
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: `Update Product Controller ERROR ${error}`,
            success: false
        })
    }
};


// DELETE Product
const deleteProductController = async (req,res) => {
    try {
        const deletedProduct = await productModel.deleteOne({ _id: req.params.id });

        res.status(200).send({
            message: "Product deleted successfully",
            deletedProduct: deletedProduct
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: `Delete Product Controller ERROR ${error}`,
            success: false
        })
    }
};

module.exports = { getProductsController, getProductsByQuery, addProductController, getProductById, getProductsByName, updateProductController, deleteProductController, getProductFilters, getFilteredProducts };