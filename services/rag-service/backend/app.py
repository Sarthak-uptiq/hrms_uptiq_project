import os
import google.generativeai as genai
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- 1. Initialize Flask App & CORS ---
app = Flask(__name__)
# CORS(app) allows the frontend (running on a different "origin") to call this backend
CORS(app) 

# --- 2. Configure Google AI ---
try:
    genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
except KeyError:
    print("Error: GOOGLE_API_KEY environment variable not set.")
    exit()

# --- 3. Dummy Knowledge Base (KB) ---
# This is our data
HR_POLICIES = [
    {
        "policy_id": "P001",
        "category": "Leave",
        "title": "Annual Vacation Policy",
        "content": "All full-time employees are entitled to 20 paid vacation days per calendar year, accrued monthly. New hires get a pro-rata share. Unused vacation days (up to 5) can be carried over to the next year."
    },
    {
        "policy_id": "P002",
        "category": "Leave",
        "title": "Sick Leave Policy",
        "content": "Employees receive 10 paid sick days per year for personal illness or caring for an immediate family member. A doctor's note is required for absences longer than 3 consecutive days."
    },
    {
        "policy_id": "P003",
        "category": "Work Arrangement",
        "title": "Work-From-Home (WFH) Policy",
        "content": "Eligible employees may work from home up to 2 days per week (e.g., Tuesdays and Thursdays) with prior approval from their direct manager. WFH arrangements are subject to review and must not impact team productivity."
    },
    {
        "policy_id": "P004",
        "category": "Conduct",
        "title": "Company Dress Code",
        "content": "The standard company dress code is business casual. This includes trousers, skirts, blouses, button-down shirts, and appropriate footwear. Fridays are designated as 'Casual Fridays', where jeans and company-branded polo shirts are acceptable."
    },
    {
        "policy_id": "P005",
        "category": "Expenses",
        "title": "Expense Reimbursement",
        "content": "Employees can submit expenses for pre-approved, work-related travel, meals, and software. All submissions must be made via the HRMS portal with valid receipts within 30 days of the expenditure. Meal expenses are capped at $50 per person per day."
    }
]

# --- 4. RAG Core Functions (Embedding, Retrieval, Generation) ---

def embed_text(text, task_type):
    """Embeds text and returns the embedding vector."""
    try:
        result = genai.embed_content(
            model="models/embedding-001",
            content=text,
            task_type=task_type)
        return result['embedding']
    except Exception as e:
        print(f"Error embedding text: {e}")
        return None

def find_relevant_policy(query, df, top_k=1):
    """Finds the most relevant policy using cosine similarity."""
    query_embedding = embed_text(query, task_type="RETRIEVAL_QUERY")
    if query_embedding is None:
        return "Error embedding query."

    doc_embeddings = np.stack(df['embedding'].values)
    sims = cosine_similarity([query_embedding], doc_embeddings)[0]
    top_k_indices = np.argsort(sims)[-top_k:][::-1]
    
    relevant_context = ""
    for idx in top_k_indices:
        relevant_context += df.iloc[idx]['content'] + "\n\n"
    return relevant_context

def generate_answer(query, context):
    """Generates an answer based on the query and retrieved context."""
    prompt_template = f"""
    You are a helpful HR Assistant. Your job is to answer employee questions based *only* on the company policies provided below.

    If the answer is not found in the policies, you *must* state:
    "I'm sorry, I don't have information on that specific topic in the provided policies."

    Here are the relevant policies:
    ---
    {context}
    ---

    Here is the employee's question:
    "{query}"

    Please provide a clear and concise answer.
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt_template)
        return response.text
    except Exception as e:
        return f"Error generating answer: {e}"

# --- 5. Pre-process KB on Server Start-up ---
# This runs ONCE when the server starts, not for every request.
print("Starting server, pre-processing knowledge base...")
df_policies = pd.DataFrame(HR_POLICIES)
df_policies['embedding'] = df_policies['content'].apply(
    lambda x: embed_text(x, task_type="RETRIEVAL_DOCUMENT")
)
df_policies = df_policies.dropna(subset=['embedding'])
print("Knowledge Base is ready and embeddings are loaded.")


# --- 6. Define the API Endpoint ---
@app.route('/chat', methods=['POST'])
def chat_handler():
    """This function will be called when the frontend sends a request to /chat."""
    try:
        # Get the user's query from the request JSON
        data = request.json
        user_query = data.get('query')

        if not user_query:
            return jsonify({'error': 'No query provided'}), 400

        print(f"Received query: {user_query}")

        # 1. Retrieve
        relevant_context = find_relevant_policy(user_query, df_policies, top_k=1)
        
        # 2. Generate
        answer = generate_answer(user_query, relevant_context)
        
        # 3. Respond
        return jsonify({'answer': answer})
    
    except Exception as e:
        print(f"Error in /chat endpoint: {e}")
        return jsonify({'error': str(e)}), 500

# --- 7. Run the Server ---
if __name__ == '__main__':
    # Runs the Flask server on port 5005
    app.run(debug=True, port=5005)