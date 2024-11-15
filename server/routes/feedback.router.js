// routes/exampleRouter.js
import express from 'express';
import { validate } from '../middlewares/validate-middleware.js';
import db from '../database/db.js';
import { feedback_dataSchema } from '../validators/validators.js';

const router = express.Router();

router.route('/feedback').post(validate(feedback_dataSchema),(req,res)=>{

  const {rating, name, feedback} = req.body;
  db.query('INSERT INTO feedback (rating, name, feedback) VALUES (?, ?, ?)', [rating, name, feedback], (err, result) => {
    if (err) {
      console.error('Error inserting feedback:', err);
      res.status(500).json({ error: 'Failed to submit feedback' });
    } else {
      res.status(201).json({ message: 'Feedback submitted successfully' });
    }
  });

})

export default router;
