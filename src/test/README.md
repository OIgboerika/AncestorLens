# Unit Tests for AncestorLens

This directory contains unit tests for the AncestorLens application. All tests are written using **Vitest** and follow best practices for testing React applications.

## 🧪 Test Structure

```
src/
├── test/
│   ├── setup.ts              # Test environment setup
│   ├── mocks/                # Mock implementations
│   │   ├── firebase.ts       # Firebase mocks
│   │   ├── cloudinary.ts     # Cloudinary mocks
│   │   └── geocoding.ts      # Geocoding API mocks
│   └── README.md             # This file
├── services/
│   └── __tests__/
│       ├── geocodingService.test.ts
│       └── cloudinaryService.test.ts
└── firebase/services/
    └── __tests__/
        ├── familyService.test.ts
        └── activityService.test.ts
```

## 🚀 Running Tests

### Run all tests

```bash
bun test
```

### Run tests in watch mode (auto-rerun on changes)

```bash
bun test --watch
```

### Run tests with UI (interactive)

```bash
bun test:ui
```

### Run tests once (CI mode)

```bash
bun test:run
```

### Run specific test file

```bash
bun test geocodingService
```

## 📋 Test Coverage

### Services Tested

1. **geocodingService** (`src/services/__tests__/geocodingService.test.ts`)

   - ✅ `geocodeAddress()` - Convert address to coordinates
   - ✅ `reverseGeocode()` - Convert coordinates to address
   - ✅ `buildAddressString()` - Build address from components
   - ✅ `getCurrentLocation()` - Get browser geolocation

2. **cloudinaryService** (`src/services/__tests__/cloudinaryService.test.ts`)

   - ✅ `uploadImage()` - Upload single image
   - ✅ `uploadAudio()` - Upload audio file
   - ✅ `uploadMultipleImages()` - Upload multiple images
   - ✅ `uploadFamilyMemberPhoto()` - Upload family member photo
   - ✅ `uploadCulturalMemoryImages()` - Upload cultural memory images
   - ✅ `uploadBurialSitePhotos()` - Upload burial site photos
   - ✅ `uploadArchiveDocument()` - Upload archive documents (PDF, images)
   - ✅ `generateThumbnailUrl()` - Generate thumbnail URLs

3. **familyService** (`src/firebase/services/__tests__/familyService.test.ts`)

   - ✅ `getFamilyMembers()` - Fetch all family members
   - ✅ `getFamilyMember()` - Fetch single family member
   - ✅ `addFamilyMember()` - Add new family member
   - ✅ `updateFamilyMember()` - Update family member
   - ✅ `deleteFamilyMember()` - Delete family member
   - ✅ `onFamilyMembersChange()` - Real-time listener

4. **activityService** (`src/firebase/services/__tests__/activityService.test.ts`)
   - ✅ `addActivity()` - Log new activity
   - ✅ `getUserActivities()` - Fetch user activities
   - ✅ `onActivitiesChange()` - Real-time activity listener
   - ✅ `logFamilyMemberAdded()` - Log family member addition
   - ✅ `logMemoryUploaded()` - Log memory upload
   - ✅ `logBurialSiteAdded()` - Log burial site addition
   - ✅ `logArchiveUploaded()` - Log archive upload

## 🔒 Safety Guarantees

### ✅ Tests Are Safe

- **No production data access** - All Firebase calls are mocked
- **No real API calls** - Cloudinary and geocoding APIs are mocked
- **No file system changes** - All file operations are mocked
- **Isolated execution** - Each test runs in isolation
- **No side effects** - Tests don't modify your codebase

### 🛡️ What Tests Do

- ✅ **Read and verify** - Tests only check if functions work correctly
- ✅ **Use mocks** - All external services are mocked
- ✅ **Test logic** - Tests verify business logic, not external APIs
- ✅ **Catch bugs** - Tests help find issues before deployment

## 📝 Writing New Tests

### Example Test Structure

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { myService } from "../myService";

describe("myService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("myFunction", () => {
    it("should do something correctly", () => {
      const result = myService.myFunction("input");
      expect(result).toBe("expected-output");
    });

    it("should handle errors gracefully", () => {
      // Test error handling
    });
  });
});
```

### Best Practices

1. **Use descriptive test names** - "should do X when Y"
2. **Test one thing per test** - Keep tests focused
3. **Use mocks for external services** - Don't make real API calls
4. **Clean up after tests** - Use `beforeEach` and `afterEach`
5. **Test edge cases** - Empty inputs, errors, null values

## 🐛 Debugging Tests

### View test output

```bash
bun test --reporter=verbose
```

### Run single test

```bash
bun test -t "test name"
```

### Debug in VS Code

1. Set breakpoints in test files
2. Run "Debug Test" from VS Code test explorer
3. Or use `debugger;` statement in tests

## 📊 Test Reports

After running tests, you'll see:

- ✅ Passed tests
- ❌ Failed tests with error messages
- ⏱️ Test execution time
- 📈 Coverage information (if configured)

## 🔄 Continuous Integration

Tests are designed to run in CI/CD pipelines:

- Fast execution (< 30 seconds)
- No external dependencies
- Deterministic results
- Clear error messages

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

---

**Note:** These tests are completely safe and will never modify your production code or data. They only verify that your functions work correctly using mocked data.
