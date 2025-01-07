---
title: 'An introduction to RAG'
date: '2022-08-08'
tags: ['rag', 'ai']
images: []
summary: "Fed up with AI that makes up facts and can't keep up with your latest data? 
That's where RAG (Retrieval-Augmented Generation) comes in – the clever technique that's changing how we build AI applications that actually work."
authors: ['wouter-heldens']
theme: 'green'
canonicalUrl: 'https://www.iodigital.com/en/history/wouter/introduction-to-rag'
---

## Why RAG Matters

Retrieval Augmented Generation (RAG) enhances AI by combining language models with external information retrieval. It improves **accuracy and relevance** by allowing AI to access up-to-date data from various sources when generating responses, overcoming the limitations of traditional language models.

## Making AI Smarter with Your Data

Under the hood, RAG typically uses vector databases to store embeddings and connects them to language models that generate the final responses. But the key thing to remember is that

> It's all about giving AI access to the right information at the right time.

### The Magic Happens in Two Steps:

**The Retrieval Part**  
Your documents are split into chunks and converted into embeddings (which we can call "semantic vectors"). When a question comes in, RAG finds the most relevant pieces from your documentation.

_The "most relevant pieces" are the chunks of text from your documentation that are semantically closest to the user's query. These pieces contain information that is most likely to be useful in answering the question or addressing the user's needs._

**The Generation Part**  
The AI model receives both the question and these relevant document pieces. Now it can generate answers using current, accurate information instead of just its training data.

### Vector Database

A working RAG (Retrieval-Augmented Generation) example requires a vector database containing retrievable data. Vector databases efficiently store and query high-dimensional vector representations of data, such as the semantic meanings of text or images.

In RAG applications, these databases enable fast nearest-neighbor searches based on semantic similarity, which is crucial for retrieving relevant context when generating responses.

**Similarity Comparisons Based on Vectors**

![rag architecture](/articles/introduction-to-rag/embeddings.jpg)

For this example, we'll use ChromaDB, an open-source vector database designed for AI applications. ChromaDB offers efficient similarity search and easy integration with machine learning models, making it ideal for semantic search and recommendation systems.

Let's create a ChromaDB instance and populate it with data to demonstrate a RAG architecture.

```python
import chromadb
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Set up ChromaDB
chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection(name="your_collection-name")

# Our story
story = """Once upon a time, three little pigs left their mother and their home to seek their own fortunes and build their own houses.
The three little pigs gathered materials for their houses.
The first little pig chose to build his house from straw, the second little pig chose to build his house from sticks, and the third little pig chose to build his house from bricks."""

# Split the text into chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=100, chunk_overlap=20)
chunks = text_splitter.split_text(story)

# Add chunks to the collection
for i, chunk in enumerate(chunks):
    collection.add(
        documents=[chunk],
        metadatas=[{"source": "Three Little Pigs story"}],
        ids=[f"chunk_{i}"]
    )
```

### RAG Architecture

Now we have a vector database with some data. Let's create a RAG system so we can ask how the third little pig built his house.

![rag architecture](/articles/introduction-to-rag/rag.png)

### 1. Query Input

The process begins with a user query, which is the initial input to the system. This query is typically a question or a request for information that the user wants the AI to address.

```python
query = 'How did the third little pig build his house?'
```

### 2. Embedding Model

The query is passed through an embedding model, which transforms the text into a numerical vector representation. This process is crucial for enabling efficient similarity comparisons between the query and the stored knowledge.

There are several options for embedding models: OpenAI's text-embeddings-3 models accessible through their API, Claude's embedding models via the Anthropic API, or open-source models from HuggingFace. Each option has different strengths in terms of quality, cost, and ease of use.

In this example, we use the OpenAI embedding model.

```python
# Create embedding function
def get_openai_embedding(query):
    response = openai.embeddings.create(
        model="text-embedding-ada-002",
        input=query
    )
    return response.data[0].embedding

# Use the embedding function with our query
question_embedding = get_openai_embedding(query)
```

### 3. Vector Database Search (Context Retrieval)

Now that we have an embedding of our query, we can search the vector database to retrieve relevant chunks of data based on their similarity to the query embedding.

```python
results = collection.query(
    query_embeddings=[question_embedding],
    n_results=2,
    where=where_filter
)
```

### 4. Language Model Processing

Now we have the query as an embedding and also two relevant chunks gathered from our vector database. It is time to put it all together in a prompt and ask OpenAI for the answer to our question. We really want to know how the third pig built his house.

Besides the question, we also need a system prompt. This system prompt tells the LLM what to do with the data and how it should behave.

When using RAG, it is better for the LLM to state that it did not find the answer based on the data you provided than to create a random answer. We can also give instructions on what format we would like to see the response. In this case, we want a well-structured JSON and we also ask the LLM to include information about the confidence of the answer.

```python
def ask_question_prompt(
    documents: str,
) -> str:

    system_prompt = f"""
    Role: Advanced Document-Based Information Retrieval Specialist

    Core Principles:
    1. Provide precise, document-sourced answers.
    2. NEVER use external or prior knowledge.
    3. Ensure clear, structured, and valid JSON responses.

    Response Structure Guidelines:
    {{
        "answer": "Comprehensive response directly from source documents.",
        "answer_confidence": "high|medium|low",
    }}

    If NO relevant information is found:
    {{
        "answer": "No relevant information in provided documents.",
        "answer_confidence": "low"
    }}

    Detailed Response Requirements:
    - Provide a comprehensive answer.

    Confidence Level Guidelines:
    - high: Multiple direct quotes, clear context.
    - medium: Some supporting evidence, partial context.
    - low: Minimal or tangential information.

    Additional Guidelines:
    - Ensure JSON is perfectly formatted.
    - Escape special characters.
    - Maintain a professional, objective tone.

    🔍 CONTEXT:
    Documents: {documents}
    """
    return system_prompt

# Use the function to create an system prompt for the LLM
system_prompt = ask_question_prompt(results['documents'])
```

Now we have the system prompt and question prompt, we can create a function that asks the LLM to give us the answer.

```python

def ask_openai_chat_model(question, system_prompt):
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",  # You can replace this with any other model
        messages=[
            {"role": "system", "content": system_prompt},  # System message to set the behavior
            {"role": "user", "content": question}  # The user's question as the prompt
        ]
    )
    # Get the assistant's reply from the response
    return response.choices[0].message.content
```

## Use Our RAG Backend

We have the RAG backend in Python ready. With this, we can create a frontend application to use it. For example, we can upload PDFs to ask questions about them.

## Why RAG is Your Next Must-Have Developer Skill

[HuggingFace embedding models](https://huggingface.co/blog/getting-started-with-embeddings)
