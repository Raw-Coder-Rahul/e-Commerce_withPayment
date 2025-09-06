import express from 'express';
import { createProducts, deleteProduct, getAllProducts, getSingleProduct, updateProduct} from '../controller/productController.js';
import { verifyUserAuth } from '../middleware/userAuth.js';
const router = express.Router();

router.route('/products')
  .get(verifyUserAuth, getAllProducts).post(createProducts);
router.route('/products/:id')
  .put(verifyUserAuth, updateProduct).delete(verifyUserAuth, deleteProduct).get(verifyUserAuth, getSingleProduct);
export default router;
