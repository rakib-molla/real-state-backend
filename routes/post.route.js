import express  from "express";
import { verifyToken } from './../middleware/verifyToken.js';
import { addPost, deletePost, getPost, getPosts, updatePost } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", verifyToken, getPost);
router.post("/", verifyToken, addPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);


export default router;