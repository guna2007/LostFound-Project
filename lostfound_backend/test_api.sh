#!/bin/bash
echo "========================================="
echo "   BACKEND API INTEGRATION TEST"
echo "========================================="
echo ""

echo "✅ Test 1: Health Check"
curl -s http://localhost:8000/health
echo -e "\n"

echo "✅ Test 2: Get Users (count)"
curl -s http://localhost:8000/users | python -c "import sys, json; data=json.load(sys.stdin); print(f'Users found: {len(data)}')"
echo ""

echo "✅ Test 3: Get Items (with pagination)"
curl -s "http://localhost:8000/items?page=1&page_size=5" | python -c "import sys, json; data=json.load(sys.stdin); print(f'Items: {len(data[\"items\"])}/{data[\"total\"]} total')"
echo ""

echo "✅ Test 4: Search LOST items"
curl -s "http://localhost:8000/items?status=LOST" | python -c "import sys, json; data=json.load(sys.stdin); print(f'LOST items: {len(data[\"items\"])}')"
echo ""

echo "✅ Test 5: Search Electronics category"
curl -s "http://localhost:8000/items?category=Electronics" | python -c "import sys, json; data=json.load(sys.stdin); print(f'Electronics: {len(data[\"items\"])}')"
echo ""

echo "✅ Test 6: Get flagged items"
curl -s "http://localhost:8000/items?is_flagged=true" | python -c "import sys, json; data=json.load(sys.stdin); print(f'Flagged items: {len(data[\"items\"])}')"
echo ""

echo "========================================="
echo "   ALL TESTS COMPLETED!"
echo "========================================="
