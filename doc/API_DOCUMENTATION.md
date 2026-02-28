# HSK Flashcard API Documentation

## Overview

The HSK Flashcard API is a simple REST API built with Express.js for managing HSK (Hanyu Shuiping Kaoshi) vocabulary flashcards organized by proficiency levels. It provides endpoints to retrieve and add flashcards with Chinese characters, pinyin, Vietnamese translations, and example sentences.

**Base URL**: `http://localhost:3000`
**Default Port**: 3000 (configurable via `PORT` environment variable)
**Technology Stack**: Express.js, Joi validation, File-based JSON storage

---

## API Endpoints

### 1. GET /flashcards/:level

Retrieves all flashcards for a specified HSK level.

**Parameters:**
- `level` (string, required, path parameter): The HSK level identifier (e.g., "hsk1", "hsk2", "hsk3", etc.)

**Success Response:**

- **Status Code**: 200 OK
- **Response Body**: Array of flashcard objects
- **Example**:
  ```json
  [
    {
      "chinese": "安静",
      "pinyin": "ānjìng",
      "vietnamese": "yên tĩnh, trầm lặng",
      "example": "请安静，图书馆里不准大声说话。",
      "example_vi": "Xin hãy yên lặng, trong thư viện không được phép nói chuyện lớn tiếng."
    },
    {
      "chinese": "开始",
      "pinyin": "kāishǐ",
      "vietnamese": "bắt đầu, khởi đầu",
      "example": "课程明天开始。",
      "example_vi": "Khóa học bắt đầu vào ngày mai."
    }
  ]
  ```

**Error Responses:**

- **Status Code**: 404 Not Found
  - **Condition**: Requested level does not exist
  - **Example**:
    ```json
    {
      "error": "Level 'hsk99' not found"
    }
    ```

- **Status Code**: 500 Internal Server Error
  - **Condition**: Server error during file I/O or processing
  - **Example**:
    ```json
    {
      "error": "Internal server error"
    }
    ```

**Example cURL Command:**
```bash
curl -X GET "http://localhost:3000/flashcards/hsk1" \
  -H "Content-Type: application/json"
```

---

### 2. POST /flashcards/:level

Adds one or more flashcards to a specified level. If the level doesn't exist, it will be created automatically.

**Parameters:**
- `level` (string, required, path parameter): The HSK level identifier (e.g., "hsk1", "hsk2", etc.)

**Request Body:**

- **Type**: Array of flashcard objects
- **Required Fields** (all fields are required):
  - `chinese` (string): Chinese characters
  - `pinyin` (string): Romanized pronunciation (pinyin)
  - `vietnamese` (string): Vietnamese translation
  - `example` (string): Example sentence in Chinese
  - `example_vi` (string): Example sentence translated to Vietnamese

- **Example**:
  ```json
  [
    {
      "chinese": "安静",
      "pinyin": "ānjìng",
      "vietnamese": "yên tĩnh, trầm lặng",
      "example": "请安静，图书馆里不准大声说话。",
      "example_vi": "Xin hãy yên lặng, trong thư viện không được phép nói chuyện lớn tiếng."
    },
    {
      "chinese": "开始",
      "pinyin": "kāishǐ",
      "vietnamese": "bắt đầu, khởi đầu",
      "example": "课程明天开始。",
      "example_vi": "Khóa học bắt đầu vào ngày mai."
    }
  ]
  ```

**Success Response:**

- **Status Code**: 201 Created
- **Response Body**:
  ```json
  {
    "message": "Added 2 flashcards to level 'hsk1'",
    "total": 2
  }
  ```
  Where `total` is the total number of flashcards in that level after the addition.

**Error Responses:**

- **Status Code**: 400 Bad Request
  - **Condition 1**: Request body is not an array
    - **Example**:
      ```json
      {
        "error": "Request body must be an array of flashcards"
      }
      ```

  - **Condition 2**: One or more flashcards fail validation (missing required fields or invalid format)
    - **Example**:
      ```json
      {
        "error": "Validation failed",
        "details": [
          "Flashcard 1: \"chinese\" is required",
          "Flashcard 2: \"pinyin\" is required"
        ]
      }
      ```

- **Status Code**: 500 Internal Server Error
  - **Condition**: Server error during file I/O or processing
  - **Example**:
    ```json
    {
      "error": "Internal server error"
    }
    ```

**Example cURL Command:**
```bash
curl -X POST "http://localhost:3000/flashcards/hsk1" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "chinese": "安静",
      "pinyin": "ānjìng",
      "vietnamese": "yên tĩnh, trầm lặng",
      "example": "请安静，图书馆里不准大声说话。",
      "example_vi": "Xin hãy yên lặng, trong thư viện không được phép nói chuyện lớn tiếng."
    }
  ]'
```

---

### 3. GET /health

Health check endpoint for monitoring API status and connectivity.

**Parameters:** None

**Success Response:**

- **Status Code**: 200 OK
- **Response Body**:
  ```json
  {
    "status": "OK",
    "timestamp": "2025-02-28T12:30:45.123Z"
  }
  ```

**Example cURL Command:**
```bash
curl -X GET "http://localhost:3000/health"
```

---

## Data Models

### Flashcard Schema

Each flashcard is a JSON object with the following structure:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `chinese` | string | Yes | The Chinese characters for the vocabulary word |
| `pinyin` | string | Yes | Romanized pronunciation using pinyin notation |
| `vietnamese` | string | Yes | Vietnamese translation of the word |
| `example` | string | Yes | Example sentence demonstrating usage in Chinese |
| `example_vi` | string | Yes | Vietnamese translation of the example sentence |

**Example Flashcard Object:**
```json
{
  "chinese": "安静",
  "pinyin": "ānjìng",
  "vietnamese": "yên tĩnh, trầm lặng",
  "example": "请安静，图书馆里不准大声说话。",
  "example_vi": "Xin hãy yên lặng, trong thư viện không được phép nói chuyện lớn tiếng."
}
```

### Level Structure

Flashcards are organized by HSK levels. The data storage uses level names as keys (e.g., "hsk1", "hsk2") and stores an array of flashcards for each level.

**Example Structure:**
```json
{
  "hsk1": [
    { flashcard object },
    { flashcard object }
  ],
  "hsk2": [
    { flashcard object }
  ],
  "hsk3": []
}
```

---

## Error Handling

### Error Response Format

All error responses follow a consistent JSON format:

**Standard Error (single error):**
```json
{
  "error": "Error description message"
}
```

**Validation Error (with details):**
```json
{
  "error": "Validation failed",
  "details": [
    "Flashcard 1: error message",
    "Flashcard 2: error message"
  ]
}
```

### HTTP Status Codes

| Code | Meaning | Scenario |
|------|---------|----------|
| 200 | OK | Successful GET request |
| 201 | Created | Successful POST request with new flashcards added |
| 400 | Bad Request | Invalid request format or validation failed (request body not array, missing required fields) |
| 404 | Not Found | Requested level does not exist (GET endpoint only) |
| 500 | Internal Server Error | Server-side error during processing or file I/O |

### Validation Error Details

When a POST request fails validation, the response includes a `details` array with specific error messages for each flashcard that failed. Each detail message follows the format:

```
Flashcard {index}: {field_name} is required
```

**Example:**
```json
{
  "error": "Validation failed",
  "details": [
    "Flashcard 1: \"chinese\" is required",
    "Flashcard 2: \"pinyin\" is required",
    "Flashcard 3: \"example_vi\" is required"
  ]
}
```

---

## Data Storage

### File-Based Storage

Flashcards are persisted in a `flashcards.json` file located in the project root directory. The data uses file-based JSON storage with direct file I/O.

**Key Characteristics:**
- **Storage Format**: JSON
- **File**: `flashcards.json`
- **Read Behavior**: Entire file is read on each GET request
- **Write Behavior**: Entire file is written on each POST request
- **No Caching**: Data is always read fresh from disk
- **Initialization**: If the file doesn't exist, a new file is created with an empty object `{}`

### flashcards.json Structure

```json
{
  "hsk1": [
    {
      "chinese": "安静",
      "pinyin": "ānjìng",
      "vietnamese": "yên tĩnh, trầm lặng",
      "example": "请安静，图书馆里不准大声说话。",
      "example_vi": "Xin hãy yên lặng, trong thư viện không được phép nói chuyện lớn tiếng."
    }
  ],
  "hsk2": [
    {
      "chinese": "开始",
      "pinyin": "kāishǐ",
      "vietnamese": "bắt đầu, khởi đầu",
      "example": "课程明天开始。",
      "example_vi": "Khóa học bắt đầu vào ngày mai."
    }
  ]
}
```

---

## Usage Examples

### Retrieve flashcards for HSK Level 1

**Request:**
```bash
curl -X GET "http://localhost:3000/flashcards/hsk1"
```

**Response (200 OK):**
```json
[
  {
    "chinese": "安静",
    "pinyin": "ānjìng",
    "vietnamese": "yên tĩnh, trầm lặng",
    "example": "请安静，图书馆里不准大声说话。",
    "example_vi": "Xin hãy yên lặng, trong thư viện không được phép nói chuyện lớn tiếng."
  }
]
```

### Add flashcards to a level

**Request:**
```bash
curl -X POST "http://localhost:3000/flashcards/hsk1" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "chinese": "开始",
      "pinyin": "kāishǐ",
      "vietnamese": "bắt đầu",
      "example": "课程明天开始。",
      "example_vi": "Khóa học bắt đầu vào ngày mai."
    }
  ]'
```

**Response (201 Created):**
```json
{
  "message": "Added 1 flashcards to level 'hsk1'",
  "total": 2
}
```

### Create a new level with flashcards

**Request:**
```bash
curl -X POST "http://localhost:3000/flashcards/hsk5" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "chinese": "例如",
      "pinyin": "lìirú",
      "vietnamese": "ví dụ, chẳng hạn",
      "example": "例如，这个句子很复杂。",
      "example_vi": "Ví dụ, câu này rất phức tạp."
    }
  ]'
```

**Response (201 Created):**
```json
{
  "message": "Added 1 flashcards to level 'hsk5'",
  "total": 1
}
```

### Check API health

**Request:**
```bash
curl -X GET "http://localhost:3000/health"
```

**Response (200 OK):**
```json
{
  "status": "OK",
  "timestamp": "2025-02-28T12:35:22.456Z"
}
```

---

## CORS Configuration

The API has CORS (Cross-Origin Resource Sharing) enabled, allowing requests from any origin. This enables the API to be accessed from web applications running on different domains.

---

## Content-Type

All endpoints that accept or return JSON data require the `Content-Type: application/json` header.

---
