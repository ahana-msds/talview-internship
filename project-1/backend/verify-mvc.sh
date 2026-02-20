#!/bin/bash

BASE_URL="http://localhost:4002/api"

echo "1. Registering User A..."
curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "userA@example.com", "password": "password123"}' | jq
echo ""

echo "2. Registering User B..."
curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "userB@example.com", "password": "password123"}' | jq
echo ""

echo "3. Logging in User A..."
TOKEN_A=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "userA@example.com", "password": "password123"}' | jq -r '.token')
echo "Token A: $TOKEN_A"
echo ""

echo "4. Logging in User B..."
TOKEN_B=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "userB@example.com", "password": "password123"}' | jq -r '.token')
echo "Token B: $TOKEN_B"
echo ""

echo "5. Creating Todo List (User A)..."
LIST_ID=$(curl -s -X POST "$BASE_URL/todo-lists" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_A" \
  -d '{"name": "User A List"}' | jq -r '.id')
echo "List ID: $LIST_ID"
echo ""

echo "6. Adding Task (User A)..."
curl -s -X POST "$BASE_URL/todo-lists/$LIST_ID/todos" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_A" \
  -d '{"text": "Task 1"}' | jq
echo ""

echo "7. Verifying User B cannot access list initially..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/todo-lists/$LIST_ID/todos" \
  -H "Authorization: Bearer $TOKEN_B")
if [ "$STATUS" == "403" ]; then
  echo "SUCCESS: User B denied access ($STATUS)"
else
  echo "FAILURE: User B accessed list ($STATUS)"
fi
echo ""

echo "8. Sharing List with User B (User A)..."
curl -s -X POST "$BASE_URL/todo-lists/$LIST_ID/share" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_A" \
  -d '{"userId": "userB@example.com", "role": "editor"}' | jq
echo ""

echo "9. Verifying User B CAN access list now..."
curl -s -X GET "$BASE_URL/todo-lists/$LIST_ID/todos" \
  -H "Authorization: Bearer $TOKEN_B" | jq
echo ""

echo "10. Unsharing List with User B (User A)..."
curl -s -X POST "$BASE_URL/todo-lists/$LIST_ID/unshare" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_A" \
  -d '{"userId": "userB@example.com"}' | jq
echo ""

echo "11. Verifying User B cannot access list anymore..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/todo-lists/$LIST_ID/todos" \
  -H "Authorization: Bearer $TOKEN_B")
if [ "$STATUS" == "403" ]; then
  echo "SUCCESS: User B denied access ($STATUS)"
else
  echo "FAILURE: User B accessed list ($STATUS)"
fi
echo ""
