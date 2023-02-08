import express from 'express';
import { getFeedPosts, getUserPosts, likePost } from '../controllers/posts';
import verifyToken from '../middleware/auth';

const router = express.Router();

//Read

router.get('/', verifyToken, getFeedposts);
router.get('/:id/posts', verifyToken, getUserPosts);

//Update
router.patch('/:id/like', verifyToken, likePost);

export default router;
