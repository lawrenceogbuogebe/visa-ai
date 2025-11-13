# Complete Workflow Guide - How Everything Works

## 🎯 Understanding the System

The Visar platform has **THREE separate document storage areas**, each serving a different purpose:

### 1. **Training Documents** (Training Page)
- **Purpose**: Teach the AI how to write like Visar
- **What to upload**: Successful and unsuccessful petitions from PREVIOUS clients
- **How AI uses it**: Learns writing style, structure, and what works/doesn't work
- **Access**: Top navigation → "Training"

### 2. **Client Documents** (Documents Tab in Client View)
- **Purpose**: Store CURRENT client's CV and evidence
- **What to upload**: The specific client's CV, awards, publications, evidence
- **How AI uses it**: Extracts ACTUAL details (names, dates, achievements) to include in petitions
- **Access**: Click client → "Documents" tab

### 3. **Templates** (Templates Page)
- **Purpose**: Reusable content structures for each criterion
- **What to create**: Sample paragraphs for Awards, Media, Judging, etc.
- **How AI uses it**: Uses as a structure guide when generating
- **Access**: Top navigation → "Templates"

---

## 📋 Complete Step-by-Step Workflow

### Phase 1: Initial Setup (Do Once)

#### Step 1: Upload Training Documents
**Goal**: Teach the AI your writing style

1. Go to **Training** page (top navigation)
2. Click **"Upload Training Document"**
3. For each document:
   - Select **"Successful Petition"** or **"Unsuccessful Petition"**
   - Choose visa type (EB-1A, EB-2 NIW, or O-1A)
   - Upload PDF/DOCX/TXT file
4. Upload at least **5-10 successful petitions** for best results
5. Optional: Upload 2-3 unsuccessful ones (so AI learns what to avoid)

**What happens**: System extracts text → Creates embeddings → Stores in Pinecone vector database

#### Step 2: Create Templates (Optional but Recommended)
**Goal**: Speed up generation with reusable structures

1. Go to **Templates** page
2. Click **"New Template"**
3. For each criterion you commonly use:
   - Select visa type
   - Select criterion (e.g., "Awards", "Media")
   - Paste your template text
4. Create templates for your 3-5 most common criteria

---

### Phase 2: Working with a Client

#### Step 3: Create Client
1. Go to **Dashboard**
2. Click **"New Client"**
3. Enter:
   - Client name: "Dr. Sarah Johnson"
   - Email: sarah@example.com
   - Visa type: EB-1A
4. Click **"Create Client"**

#### Step 4: Upload Client Documents
**CRITICAL**: This is where you upload the CURRENT client's materials

1. Click on the client card
2. Go to **"Documents"** tab
3. Upload their CV:
   - Click **"Upload Document"**
   - File Type: **"CV/Resume"**
   - Select their CV file
4. Upload evidence documents:
   - Click **"Upload Document"** again
   - File Type: **"Evidence Document"**
   - Upload award letters, publications, etc.

**Important**: Upload ALL relevant documents - the AI will read them!

---

### Phase 3: Generate Petition Content

#### Option A: Using AI Chat (Quick drafts and questions)

1. Stay in client view, **"AI Assistant"** tab
2. Ask questions or request short content:
   - "What are the key requirements for the Awards criterion?"
   - "Draft a paragraph about Dr. Johnson's 2023 IEEE Fellow Award"
   - "Help me structure the Original Contributions section"

**Best for**: 
- Quick questions
- Short paragraphs
- Brainstorming
- Guidance on structure

#### Option B: Generate Full Petition Section (Recommended)

1. Go to **"Petitions"** tab
2. Click **"Generate Petition"**
3. Fill the form:
   - **Criterion**: Select (e.g., "Awards") or leave blank for general
   - **Prompt**: Be VERY specific!
   
**Example Prompt**:
```
Draft a comprehensive Awards section for Dr. Sarah Johnson's EB-1A petition. 
Emphasize her 2023 IEEE Fellow Award (0.1% acceptance rate), the 2022 Turing Award 
for contributions to machine learning, and 8 other international awards in AI research. 
Highlight that she received more recognition than 99.9% of researchers in her field. 
Include specific citations and impact metrics from her CV.
```

4. Click **"Generate"**
5. Wait 20-60 seconds (AI is processing)
6. Review the generated content
7. Click **"Copy"** button to copy to clipboard

---

## 🤖 How the AI Generation Works

When you click "Generate", here's what happens:

```
1. AI reads CLIENT DOCUMENTS (CV, evidence) you uploaded in Documents tab
   ↓
2. Searches TRAINING DOCUMENTS for relevant examples
   ↓
3. Retrieves matching TEMPLATES if criterion was selected
   ↓
4. Combines everything with your PROMPT
   ↓
5. GPT-4o generates petition using:
   - Real names, dates, achievements from CLIENT CV
   - Writing style learned from TRAINING DOCUMENTS
   - Structure from TEMPLATES
   - Specific details from your PROMPT
   ↓
6. Output is formatted and displayed with Copy button
```

---

## ✅ Key Differences Explained

### Training vs Client Documents

| Training Documents | Client Documents |
|-------------------|------------------|
| **Past clients' petitions** | **Current client's CV/evidence** |
| Teaches writing style | Provides actual details to include |
| Upload once, use for all clients | Upload for each new client |
| In "Training" page | In "Documents" tab per client |

### Example:

**Training Document** (from past client):
```
"Dr. Smith received the prestigious XYZ Award in 2020, which is granted 
to only 0.1% of researchers annually. This recognition places Dr. Smith 
among the most accomplished scholars in the field..."
```
↓ AI learns this STYLE

**Client Document** (current client's CV):
```
Name: Dr. Sarah Johnson
Awards:
- 2023 IEEE Fellow Award
- 2022 Turing Award
- 2021 Best Paper Award
```
↓ AI extracts these FACTS

**Generated Output**:
```
"Dr. Johnson received the prestigious IEEE Fellow Award in 2023, which 
is granted to only 0.1% of researchers annually. This recognition places 
Dr. Johnson among the most accomplished scholars in electrical engineering..."
```
↑ AI used the STYLE from training + FACTS from CV

---

## 🎨 Formatting Improvements

### New Features:
✅ **Copy Button**: One-click copy for all generated petitions
✅ **Better Formatting**: Bold text, bullets, headers properly displayed
✅ **Delete Options**: Remove unwanted templates and training documents

### Reading Generated Content:
- **Bold text** shows emphasis
- Bullet points are properly formatted
- Headers organize sections
- Click "Copy" to paste into your document editor

---

## 💡 Pro Tips for Best Results

### 1. Be Specific in Prompts
❌ **Bad**: "Write about awards"
✅ **Good**: "Draft awards section for Dr. Johnson highlighting her 2023 IEEE Fellow Award (0.1% acceptance), emphasizing international recognition and comparison to field averages"

### 2. Upload Quality Training Data
- Upload COMPLETE petitions, not fragments
- Include successful AND unsuccessful (to learn what to avoid)
- Upload petitions similar to what you want to generate

### 3. Keep Client Documents Updated
- Upload latest CV
- Add new awards/publications as evidence
- Include ALL relevant documents

### 4. Review and Refine
- AI generates 80-90% ready content
- Review for accuracy
- Edit specific details if needed
- Regenerate with refined prompt if necessary

### 5. Use Templates Strategically
- Create templates for your most common criteria
- Keep them concise (structure, not full content)
- Let AI fill in specific client details

---

## 🔍 Common Questions

### Q: Why doesn't the AI use information from the CV I uploaded?
**A**: Make sure you:
1. Uploaded to **"Documents" tab** (not Training page)
2. Waited a few seconds for processing
3. Included specific details in your prompt to guide the AI

### Q: The output is too generic with placeholders like [Your Name]
**A**: This means AI couldn't find specific info. Check:
1. CV is uploaded in Documents tab
2. CV contains relevant information
3. Your prompt mentions what to look for in the CV

### Q: How many training documents should I upload?
**A**: 
- Minimum: 3-5 successful petitions per visa type
- Recommended: 10-15 total (mix of EB-1A, EB-2 NIW, O-1A)
- More is better for AI learning!

### Q: Can I edit generated petitions?
**A**: Yes! 
1. Click "Copy" button
2. Paste into your document editor (Word, Google Docs)
3. Edit as needed

### Q: Do I need to upload training documents for EVERY client?
**A**: No! Upload training documents ONCE in the Training page. They're used for ALL clients.

### Q: What's the difference between Chat and Petition Generator?
**A**:
- **Chat**: Quick questions, short content, guidance
- **Petition Generator**: Full sections with specific criterion, complete formatted output

---

## 🚀 Recommended Workflow for New Users

**First Time Setup (30 minutes):**
1. Upload 5-10 successful petitions to Training page
2. Create 3-5 templates for common criteria
3. Test with one client to understand the system

**For Each New Client (10-15 minutes):**
1. Create client
2. Upload their CV and evidence to Documents tab
3. Generate 2-3 petition sections
4. Review and refine

**Ongoing Maintenance:**
- Add new training documents as you complete successful cases
- Update templates based on what works well
- Delete outdated or incorrect content

---

## 📊 Cost Optimization

Each petition generation costs approximately **$0.01-0.05** depending on length.

**To minimize costs:**
- Be specific in prompts (avoid regenerating)
- Use chat for quick questions
- Use petition generator for full sections
- Upload quality training data (better output = less regeneration)

**Expected monthly costs:**
- 10 clients/month: ~$5-10 in AI usage
- 50 clients/month: ~$20-40 in AI usage
- Plus hosting: $15-20/month

---

## 🎯 Success Checklist

Before generating your first petition, ensure:
- [ ] Uploaded 5+ training documents
- [ ] Created at least 2 templates
- [ ] Uploaded client's CV in Documents tab
- [ ] Uploaded evidence documents
- [ ] Wrote specific, detailed prompt
- [ ] Selected appropriate criterion (if applicable)

---

**You're now ready to generate high-quality AI-powered petitions!** 🎉

Start with the Training page, then work through a test client to get comfortable with the workflow.
