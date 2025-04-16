import React, { useState } from "react";
import Container from "../ui/Container";
import Title from "../ui/Title";

// UTSA Colors
const utsaColors = {
  navy: "#0C2340",
  orange: "#F15A22"
};

const SimpleForum = () => {
  // State for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Hard-coded FAQ data
  const faqData = [
    {
      id: 1,
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page. Follow the instructions sent to your email to create a new password.",
      category: "Account",
      answeredBy: "Admin"
    },
    {
      id: 2,
      question: "When will my order arrive?",
      answer: "Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. You can track your order status in your account dashboard.",
      category: "Orders",
      answeredBy: "Support Team"
    },
    {
      id: 3,
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to over 50 countries worldwide. International shipping typically takes 7-14 business days depending on the destination.",
      category: "Shipping",
      answeredBy: "Logistics"
    },
    {
      id: 4,
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all unused items in original packaging. Please contact our support team to initiate a return.",
      category: "Returns",
      answeredBy: "Customer Service"
    },
    {
      id: 5,
      question: "How can I contact customer support?",
      answer: "You can reach our customer support team via email at support@example.com or by phone at (555) 123-4567 between 9 AM and 5 PM EST, Monday through Friday.",
      category: "Support",
      answeredBy: "Admin"
    }
  ];

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log("Question submitted:", { name, email, question });
    // Reset form and show success message
    setName("");
    setEmail("");
    setQuestion("");
    setSubmitted(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <Container>
      {/* Forum Header */}
      <div className="mb-10">
        <Title text="Forum & FAQs" className="text-center text-[#0C2340]" />
        <p className="text-center mt-2" style={{ color: utsaColors.navy }}>
          Find answers to common questions or ask your own
        </p>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6" style={{ color: utsaColors.navy }}>Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqData.map((faq) => (
            <div key={faq.id} className="border rounded-lg shadow-sm" style={{ borderColor: utsaColors.navy }}>
              <details className="group">
                <summary className="flex justify-between items-center p-4 cursor-pointer font-medium" 
                  style={{ backgroundColor: utsaColors.navy, color: "white" }}>
                  <span>{faq.question}</span>
                  <span className="transition group-open:rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="p-4 pt-0 text-gray-700">
                  <p>{faq.answer}</p>
                  <p className="mt-2 text-sm" style={{ color: utsaColors.orange }}>
                    Answered by: {faq.answeredBy} | Category: {faq.category}
                  </p>
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>

      {/* Ask a Question Section */}
      <div className="p-6 rounded-lg" style={{ backgroundColor: "#f8f9fa", borderLeft: `4px solid ${utsaColors.orange}` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: utsaColors.navy }}>Ask a Question</h2>
        <p className="mb-6" style={{ color: utsaColors.navy }}>
          Can't find what you're looking for? Submit your question and our team will get back to you.
        </p>

        {submitted && (
          <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: "#e8f4f9", color: utsaColors.navy, border: `1px solid ${utsaColors.navy}` }}>
            Your question has been submitted successfully! We'll answer it soon.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1 font-medium" style={{ color: utsaColors.navy }}>
              Your Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-2 border rounded"
              style={{ borderColor: utsaColors.navy }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 font-medium" style={{ color: utsaColors.navy }}>
              Your Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border rounded"
              style={{ borderColor: utsaColors.navy }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="question" className="block mb-1 font-medium" style={{ color: utsaColors.navy }}>
              Your Question
            </label>
            <textarea
              id="question"
              rows={4}
              className="w-full p-2 border rounded"
              style={{ borderColor: utsaColors.navy }}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="text-white py-2 px-4 rounded hover:opacity-90"
            style={{ backgroundColor: utsaColors.orange }}
          >
            Submit Question
          </button>
        </form>
      </div>
    </Container>
  );
};

export default SimpleForum;