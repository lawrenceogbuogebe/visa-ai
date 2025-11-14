# EB-2 NIW Complete Workflow Specification

## Overview
Comprehensive petition generation system with guided workflow, Google Docs export, and unlimited revisions.

---

## Phase 1: Quick Fixes ✅ COMPLETED

### 1. Sorting & Organization
- ✅ Petitions sorted newest first (DESC by created_at)
- ✅ Delete buttons for uploaded documents
- ✅ Clear chat functionality
- ✅ Clickable VisaroAI logo → navigate to home

### 2. Backend Endpoints Added
- ✅ DELETE `/api/documents/{document_id}`
- ✅ DELETE `/api/chat/history/{client_id}`
- ✅ DELETE `/api/petitions/{petition_id}`
- ✅ Sorted petition retrieval

---

## Phase 2: Google Docs Export (NEXT)

### Implementation Plan

#### Backend: Google Docs API Integration
```python
# New endpoint
@api_router.post("/petitions/{petition_id}/export")
async def export_to_google_docs(petition_id: str):
    # 1. Get petition content
    # 2. Format with proper structure
    # 3. Create Google Doc via API
    # 4. Apply formatting (bold, headers, bullets)
    # 5. Share with user
    # 6. Return Google Docs link
```

#### Frontend: Export Button
- Add "Export to Docs" button on each petition card
- Shows Google Docs icon
- Opens modal with Google Docs link
- One-click copy link

#### Formatting Rules for Export
- **Headers**: H1 for criterion, H2 for sub-sections
- **Bold**: Key terms and names
- **Bullets**: Evidence lists
- **Spacing**: Professional 1.15 line spacing
- **Font**: Times New Roman 12pt (USCIS standard)
- **Margins**: 1" all sides

---

## Phase 3: Complete EB-2 NIW Workflow System

### Workflow Steps

#### Step 1: Professional Background Form
**Location**: New page/modal from Dashboard

**Form Fields**:
```
- Full Name
- Field/Industry
- Highest Degree
- Years of Experience
- Key Achievements (textarea)
- Publications Count
- Awards/Recognition
- Current Position
- Research Focus
```

**Action**: Click "Generate EB-2 NIW Petition"

---

#### Step 2: AI Generates Proposed Endeavors
**Backend**:
- Use existing `/api/endeavor/suggest` endpoint
- Enhanced with professional background data
- Generate 5-7 specific proposed endeavors

**Frontend Display**:
```
┌─────────────────────────────────────────────┐
│ Proposed Endeavors (Select 1-3)             │
├─────────────────────────────────────────────┤
│ □ Endeavor 1: [AI generated]                │
│ □ Endeavor 2: [AI generated]                │
│ □ Endeavor 3: [AI generated]                │
│ ...                                          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ National Interest Arguments (Select 3-5)     │
├─────────────────────────────────────────────┤
│ □ Substantial Merit: [AI generated angle]   │
│ □ National Importance: [AI generated]       │
│ □ Well Positioned: [AI generated]           │
│ ...                                          │
└─────────────────────────────────────────────┘
```

---

#### Step 3: Generate Full Cover Letter
**User Action**: Select options → Click "Generate Cover Letter"

**AI Generation**:
- Uses selected endeavors
- Uses selected arguments
- Uses client CV/documents
- Uses training documents (precedent decisions)
- Generates complete I-140 cover letter

**Structure**:
1. Introduction
2. Proposed Endeavor
3. Substantial Merit & National Importance
4. Well Positioned to Advance
5. Balance of Interests
6. Conclusion

---

#### Step 4: Review & Revisions
**Interface**:
```
┌─────────────────────────────────────────────┐
│ Cover Letter Draft                           │
├─────────────────────────────────────────────┤
│ [Full formatted content]                     │
│                                              │
│ [Request Revision]  [Generate Variant]      │
│ [Export to Docs]    [Approve & Continue]    │
└─────────────────────────────────────────────┘
```

**Revision Options**:
- Text box: "What would you like to change?"
- AI regenerates specific section
- Unlimited revisions
- Track revision history

**Variant Generation**:
- "Generate alternative version"
- Different tone/approach
- Same facts, different presentation

---

#### Step 5: Reference Letters Generation
**Trigger**: After cover letter approval

**Process**:
1. AI asks: "How many reference letters? (3-5 recommended)"
2. For each letter:
   - Recommender name
   - Recommender position/title
   - Relationship to petitioner
   - Focus area (research, collaboration, impact, etc.)
3. AI generates personalized reference letters
4. Each letter has unique tone and perspective
5. All reference same core achievements

**Reference Letter Structure**:
- Introduction (recommender credentials)
- How they know petitioner
- Specific achievements witnessed
- Impact assessment
- Strong recommendation

---

## Phase 4: Complete Petition Package

### Documents Generated:
1. ✅ **Cover Letter** (I-140 petition letter)
2. ✅ **Reference Letters** (3-5 letters)
3. 📋 **Exhibits List** (auto-generated from uploaded docs)
4. 📋 **Table of Contents**
5. 📋 **Executive Summary** (optional)

### Package Organization:
```
Petition Package/
├── Cover_Letter.docx
├── Reference_Letters/
│   ├── Letter_1_Dr_Smith.docx
│   ├── Letter_2_Prof_Johnson.docx
│   ├── Letter_3_Dr_Williams.docx
├── Exhibits_List.docx
└── Table_of_Contents.docx
```

---

## UI/UX Design

### New Petition Workflow Page

**Landing State**:
```
┌────────────────────────────────────────────────┐
│  EB-2 NIW Petition Builder                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                 │
│  📝 Professional Background                     │
│  🎯 Proposed Endeavors                         │
│  📄 Cover Letter                               │
│  ✉️  Reference Letters                         │
│  📦 Complete Package                           │
│                                                 │
│  [Start New Petition]                          │
└────────────────────────────────────────────────┘
```

**Progress Indicator**:
```
① Background → ② Endeavors → ③ Cover Letter → ④ References → ⑤ Package
   [Done]        [Current]      [Pending]        [Pending]       [Pending]
```

**Petition Card (Collapsed)**:
```
┌────────────────────────────────────────────────┐
│ EB-2 NIW Petition - Dr. Sarah Johnson      ▼  │
│ Created: 11/14/2025                            │
│ Status: Cover Letter Approved                  │
│                                                 │
│ 📄 Documents: 1 Cover Letter, 3 References     │
│ [Continue] [Export All] [Delete]               │
└────────────────────────────────────────────────┘
```

**Petition Card (Expanded)**:
```
┌────────────────────────────────────────────────┐
│ EB-2 NIW Petition - Dr. Sarah Johnson      ▲  │
│ Created: 11/14/2025                            │
│ Status: Cover Letter Approved                  │
├────────────────────────────────────────────────┤
│                                                 │
│ 📄 Cover Letter                                │
│    [View] [Edit] [Regenerate] [Export]        │
│                                                 │
│ ✉️  Reference Letter 1 - Dr. Smith            │
│    [View] [Edit] [Regenerate] [Export]        │
│                                                 │
│ ✉️  Reference Letter 2 - Prof. Johnson        │
│    [View] [Edit] [Regenerate] [Export]        │
│                                                 │
│ ✉️  Reference Letter 3 - Dr. Williams         │
│    [View] [Edit] [Regenerate] [Export]        │
│                                                 │
│ [+ Add Reference Letter]                       │
│ [Export Complete Package]                      │
└────────────────────────────────────────────────┘
```

---

## Database Schema Changes

### New Collections:

#### `petition_workflows`
```javascript
{
  id: uuid,
  client_id: string,
  status: enum [
    'background_form',
    'endeavor_selection',
    'cover_letter_draft',
    'cover_letter_approved',
    'references_generation',
    'complete'
  ],
  background_data: {
    name: string,
    field: string,
    degree: string,
    experience_years: int,
    achievements: string,
    // ... more fields
  },
  selected_endeavors: [string],
  selected_arguments: [string],
  documents: {
    cover_letter_id: string,
    reference_letters: [string],
    exhibits_list_id: string
  },
  created_at: datetime,
  updated_at: datetime
}
```

#### Update `petitions` collection:
```javascript
{
  // existing fields...
  petition_type: enum ['criterion', 'cover_letter', 'reference_letter'],
  workflow_id: string (optional),
  document_role: string (e.g., 'cover_letter', 'reference_1'),
  google_docs_url: string (optional)
}
```

---

## Technical Implementation

### Backend Endpoints Needed:

```python
# Workflow management
POST   /api/workflows/create          # Start new petition workflow
GET    /api/workflows/{workflow_id}   # Get workflow state
PUT    /api/workflows/{workflow_id}   # Update workflow

# Endeavor generation
POST   /api/workflows/{id}/endeavors  # Generate endeavors
PUT    /api/workflows/{id}/endeavors  # Save selections

# Cover letter
POST   /api/workflows/{id}/cover-letter    # Generate
POST   /api/workflows/{id}/cover-letter/revise  # Revise
POST   /api/workflows/{id}/cover-letter/variant  # New variant

# Reference letters
POST   /api/workflows/{id}/references       # Generate all
POST   /api/workflows/{id}/references/{n}/revise  # Revise one
POST   /api/workflows/{id}/references/add   # Add another

# Export
POST   /api/workflows/{id}/export           # Export all to Google Docs
POST   /api/petitions/{id}/export          # Export single document
```

### Frontend Components:

```
src/pages/
├── PetitionWorkflow.jsx       # Main workflow orchestrator
├── BackgroundForm.jsx         # Step 1
├── EndeavorSelection.jsx      # Step 2
├── CoverLetterEditor.jsx      # Step 3
├── ReferenceLetters.jsx       # Step 4
└── PackageView.jsx            # Step 5

src/components/
├── WorkflowProgress.jsx       # Progress indicator
├── DocumentCard.jsx           # Individual document display
├── RevisionModal.jsx          # Request changes
└── ExportModal.jsx            # Google Docs export
```

---

## Google Docs Export Implementation

### Option 1: Google Docs API (Recommended)
**Pros**: Native Google Docs, collaborative editing, version history
**Cons**: Requires OAuth, API setup

**Steps**:
1. Set up Google Cloud Project
2. Enable Google Docs API
3. Implement OAuth flow
4. Create document via API
5. Format with batchUpdate
6. Share with user email

### Option 2: Export as .docx
**Pros**: Simpler, no API needed, works offline
**Cons**: Not native Google Docs, extra step for user

**Steps**:
1. Generate .docx with python-docx
2. Store temporarily
3. Provide download link
4. User uploads to Google Drive manually

### Recommended: Hybrid Approach
- Default: .docx download
- Optional: "Export to Google Docs" (requires one-time auth)
- Best of both worlds

---

## Implementation Timeline

### Immediate (Phase 1) ✅
- Sorting, delete buttons, logo click
- **Status**: COMPLETE

### Next Sprint (Phase 2) - 2-3 hours
- Google Docs export (.docx method)
- Export button on petition cards
- Formatted output

### Major Feature (Phase 3) - 4-6 hours
- Complete EB-2 NIW workflow
- Multi-step form
- Endeavor selection
- Cover letter generation
- Reference letters
- Revision system

### Polish (Phase 4) - 2 hours
- UI refinements
- Loading states
- Error handling
- Testing

---

## Success Criteria

✅ User can complete entire EB-2 NIW petition in one session
✅ All documents export to properly formatted Google Docs
✅ Unlimited revisions without losing previous versions
✅ Reference letters sound distinct and authentic
✅ Cover letter follows USCIS best practices
✅ Training documents influence writing style
✅ System generates submission-ready documents

---

**Next Steps**: 
1. Test current changes (sorting, delete buttons)
2. Implement Google Docs export
3. Build workflow system
4. User testing
