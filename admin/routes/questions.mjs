import { Router } from "express";
import { db } from "../constants/firebase.mjs";
import { doc, collection, query,
        where, updateDoc, getDocs } from "firebase/firestore";

const router = Router();



// Admin submits an answer to a question
router.post("/:id/answer", async (req, res) => {
  const questionId = req.params.id;
  const { answer } = req.body;

  if (!answer) {
    return res.status(400).json({ error: "Answer is required" });
  }

  try {
    const questionRef = doc(db, "Questions", questionId);
    await updateDoc(questionRef, { answer });
    res.json({ success: true, message: "Answer posted successfully!" });
  } catch (error) {
    console.error("Error posting answer:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// List unanswered questions
router.get("/", async (req, res) => {
  try {
    const questionsRef = collection(db, "Questions");
    const q = query(questionsRef, where("answer", "==", null));
    const snapshot = await getDocs(q);

    const unanswered = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(unanswered);
  } catch (err) {
    console.error("Failed to fetch unanswered questions:", err);
    res.status(500).send("Error retrieving questions");
  }
});

export default router;
