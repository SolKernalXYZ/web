#!/bin/bash
# Pre-Push Verification Script for SolKernal
# Run this before pushing to GitHub

echo ""
echo "🔍 SolKernal - Pre-Push Verification"
echo "======================================"
echo ""

ERRORS=0

# Check 1: Git initialized
echo "✓ Checking git initialization..."
if [ -d .git ]; then
    echo "  ✅ Git repository initialized"
else
    echo "  ❌ Git not initialized. Run: git init"
    ERRORS=$((ERRORS + 1))
fi

# Check 2: .gitignore exists
echo ""
echo "✓ Checking .gitignore..."
if [ -f .gitignore ]; then
    echo "  ✅ .gitignore exists"
else
    echo "  ❌ .gitignore missing!"
    ERRORS=$((ERRORS + 1))
fi

# Check 3: LICENSE exists
echo ""
echo "✓ Checking LICENSE..."
if [ -f LICENSE ]; then
    echo "  ✅ LICENSE exists"
else
    echo "  ⚠️  LICENSE missing"
fi

# Check 4: Sensitive files are ignored
echo ""
echo "✓ Checking if sensitive files are ignored..."

for file in "web/.env" "web/.env.local" "web/.env.production" "web/dev.db" "web/.next" "web/node_modules"; do
    if git check-ignore -q "$file" 2>/dev/null; then
        echo "  ✅ $file is ignored"
    else
        if [ -e "$file" ]; then
            echo "  ❌ $file EXISTS but NOT IGNORED!"
            ERRORS=$((ERRORS + 1))
        fi
    fi
done

# Check 5: No .env files in git
echo ""
echo "✓ Checking for .env files in git index..."
ENV_FILES=$(git ls-files | grep "\.env[^.]" || true)
if [ -n "$ENV_FILES" ]; then
    echo "  ❌ Found .env files in git:"
    echo "$ENV_FILES" | sed 's/^/    - /'
    ERRORS=$((ERRORS + 1))
else
    echo "  ✅ No .env files in git index"
fi

# Check 6: No database files in git
echo ""
echo "✓ Checking for database files in git index..."
DB_FILES=$(git ls-files | grep -E "\.db$|\.sqlite" || true)
if [ -n "$DB_FILES" ]; then
    echo "  ❌ Found database files in git:"
    echo "$DB_FILES" | sed 's/^/    - /'
    ERRORS=$((ERRORS + 1))
else
    echo "  ✅ No database files in git index"
fi

# Check 7: .env.example exists
echo ""
echo "✓ Checking for .env.example..."
if [ -f "web/.env.example" ]; then
    echo "  ✅ .env.example exists"
else
    echo "  ⚠️  .env.example missing"
fi

# Final Summary
echo ""
echo "======================================"
if [ $ERRORS -eq 0 ]; then
    echo "✅ ALL CHECKS PASSED! Safe to push."
    echo ""
    echo "Next steps:"
    echo "  1. git add ."
    echo "  2. git commit -m 'Initial commit: SolKernal v1.0'"
    echo "  3. git remote add origin https://github.com/SolKernalXYZ/web.git"
    echo "  4. git push -u origin main"
else
    echo "❌ FOUND $ERRORS ERROR(S)! DO NOT PUSH."
    echo "   Fix the errors above first."
fi
echo "======================================"
echo ""
