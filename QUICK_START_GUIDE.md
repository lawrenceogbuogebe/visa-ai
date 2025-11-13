# Visar Quick Start Guide

## ✅ System Status
- **Backend**: Running with GPT-4o AI model
- **Frontend**: Running at https://petition-wizard.preview.emergentagent.com
- **Emergent LLM Key**: Already integrated and working
- **Database**: MongoDB connected
- **Vector DB**: Pinecone connected

---

## 🚀 How to Use the System

### 1. Training the AI (Most Important!)

**Go to the "Training" page to upload your successful/unsuccessful petitions:**

1. Click **"Training"** in the top navigation
2. Click **"Upload Training Document"** button
3. Fill in:
   - **Document Type**: 
     - "Successful Petition" - petitions that were approved
     - "Unsuccessful Petition" - petitions that were denied
   - **Visa Type**: EB-1A, EB-2 NIW, or O-1A
   - **File**: Upload PDF, DOCX, or TXT file
4. Click **"Upload"**

**What happens behind the scenes:**
- System extracts text from your document
- Creates AI embeddings (vector representations)
- Stores in Pinecone vector database
- When generating new petitions, the AI retrieves relevant content from these documents

**Tip:** Upload at least 3-5 successful petitions for each visa type to get the best results!

---

### 2. Creating Clients

1. Go to **Dashboard**
2. Click **"New Client"** button
3. Fill in:
   - Client Name (e.g., "Dr. John Smith")
   - Email
   - Visa Type (EB-1A, EB-2 NIW, or O-1A)
4. Click **"Create Client"**

---

### 3. Uploading Client Documents

1. Click on a client card to open their page
2. Go to **"Documents"** tab
3. Click **"Upload Document"**
4. Select:
   - File Type: "Evidence Document" or "CV/Resume"
   - Choose file (PDF, DOCX, TXT)
5. Click **"Upload"**

**Note:** These are for your records. To train the AI, use the Training page instead.

---

### 4. Using the AI Chat Assistant

1. Click on a client card
2. **"AI Assistant"** tab is active by default
3. Type your question or request in the chat box
4. Click **"Send"**

**Example questions:**
- "Help me draft an introduction for this EB-1A petition"
- "What evidence should I emphasize for the Original Contributions criterion?"
- "Draft a paragraph about the client's awards and achievements"

**The AI will:**
- Consider the client's visa type
- Use any training documents you've uploaded
- Provide professional, USCIS-compliant content

---

### 5. Generating Full Petition Sections

1. Click on a client
2. Go to **"Petitions"** tab
3. Click **"Generate Petition"**
4. Fill in:
   - **Criterion** (optional): Select specific criterion like "Awards", "Media", etc.
   - **Prompt**: Describe what you want
     - Example: "Draft a comprehensive section for the Awards criterion highlighting international recognition in artificial intelligence research, including the 2023 Turing Award and 5 other major awards."
5. Click **"Generate"**

**The AI will create:**
- Professional petition language
- Evidence-backed arguments
- Context from your training documents
- Aligned with USCIS requirements

---

### 6. Creating Templates (Optional but Recommended)

1. Go to **"Templates"** page
2. Click **"New Template"**
3. Fill in:
   - **Visa Type**: EB-1A, EB-2 NIW, or O-1A
   - **Criterion**: Select from available criteria
   - **Content**: Your template text
4. Click **"Create Template"**

**Why use templates?**
- The AI uses these as additional context when generating petitions
- Ensures consistent style and structure
- Speeds up generation

---

## 🔑 About the Emergent LLM Key

### What is it?
- A universal API key that works with OpenAI, Anthropic, and Google AI models
- Already integrated in your system
- You don't need to get an OpenAI API key separately

### Where is it used?
- AI Chat Assistant
- Petition Generation
- All AI-powered features

### Cost & Billing
- Pay-as-you-go based on usage
- Typical costs: $0.01-0.05 per petition generation
- To add balance: Profile → Universal Key → Add Balance (on Emergent platform)

### Current Configuration
- Model: **GPT-4o** (latest OpenAI model)
- Provider: OpenAI via Emergent
- Status: ✅ Working

---

## 🎯 Best Practices

### For Best AI Results:

1. **Upload Training Documents First**
   - At least 3-5 successful petitions per visa type
   - Include both successful and unsuccessful examples
   - More training data = better output

2. **Be Specific in Prompts**
   - ❌ Bad: "Write about awards"
   - ✅ Good: "Draft a paragraph about the client's 2023 IEEE Fellow Award, emphasizing its selectivity (0.1% acceptance rate) and international recognition in computer vision research"

3. **Use the Right Tools**
   - **Chat**: For questions, guidance, short drafts
   - **Petition Generator**: For full sections with specific criteria
   - **Templates**: For reusable content structures

4. **Organize by Visa Type**
   - Keep training documents organized by visa type
   - Create templates for commonly used criteria
   - Maintain separate clients for different visa categories

---

## 🐛 Troubleshooting

### "AI chat doesn't respond" or "Generation fails"
**Fixed!** ✅ The system now uses GPT-4o model which is available and working.
- If it still fails, check your Emergent LLM key balance
- Backend logs: `tail -f /var/log/supervisor/backend.err.log`

### "Petition generation times out"
- This is normal for long, complex petitions (can take 30-60 seconds)
- The AI is thinking and crafting quality content
- Don't refresh the page - wait for the response

### "Upload fails"
- Check file format: PDF, DOCX, or TXT only
- File size limit: 10MB
- Make sure file is not corrupted

### "No relevant context from training docs"
- Upload more training documents
- Ensure documents are related to the visa type you're generating for
- Wait a few seconds after upload for indexing to complete

---

## 📊 Understanding the System

### What happens when you generate a petition:

1. **Your Prompt** → Sent to AI
2. **Client Info** → Added to context (name, visa type)
3. **Templates** → Retrieved if available for the criterion
4. **Training Docs** → Pinecone searches for relevant content
5. **AI Processing** → GPT-4o generates professional content
6. **Output** → Saved to database and displayed

### The RAG (Retrieval-Augmented Generation) System:

```
Your Training Documents
    ↓
Text Extraction
    ↓
AI Embeddings (Sentence Transformers)
    ↓
Pinecone Vector Database
    ↓
Semantic Search (when generating)
    ↓
Relevant Context → GPT-4o → High-Quality Output
```

---

## 🚀 Next Steps

### To Make the AI Smarter:
1. Upload 10+ successful petitions (mix of all visa types)
2. Upload 3-5 unsuccessful petitions (to learn what to avoid)
3. Create templates for your most common criteria
4. Test with a few clients to refine your prompts

### For Production Deployment:
- See main README.md for Vercel/Railway deployment
- Expected cost: $15-70/month (hosting + AI usage)
- MongoDB Atlas free tier is sufficient to start

---

## 💡 Pro Tips

1. **Start with Training**: The more training data, the better the output
2. **Specific Prompts**: Include numbers, dates, percentages, specific achievements
3. **Review & Edit**: Always review AI-generated content for accuracy
4. **Iterate**: If output isn't perfect, refine your prompt and try again
5. **Use Templates**: Create reusable templates for common patterns
6. **Track Usage**: Monitor your Emergent LLM key balance to control costs

---

## 📧 Support

For technical issues or questions about the Emergent LLM key:
- Check backend logs: `tail -f /var/log/supervisor/backend.err.log`
- Check frontend logs: Browser console (F12)
- Emergent platform support for billing/API key issues

---

**The system is now fully functional and ready to use!** 🎉

Start by uploading some training documents, then create a client and test the AI chat!
