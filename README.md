# Blooms Academy Automation Framework

This is a Playwright-based test automation framework for the Blooms Academy application, following industry-standard practices and the Page Object Model (POM) design pattern.

## Project Structure

```
.
├── pages/                 # Page Object Model classes
├── tests/                 # Test specifications
├── test-data/             # Test data files
├── report/                # Test reports and results
├── playwright.config.ts   # Playwright configuration
├── package.json           # Project dependencies
└── tsconfig.json          # TypeScript configuration
```

## Standards and Best Practices

### 1. Page Object Model (POM)
All page interactions are encapsulated in page classes that extend [BasePage](pages/Basepage.ts).

### 2. Naming Conventions
- Classes: PascalCase (e.g., `LoginPage`)
- Methods: camelCase (e.g., `verifyLoginPageElements()`)
- Constants: UPPER_SNAKE_CASE (e.g., `USERNAME_FIELD`)
- Variables: camelCase (e.g., `loginPage`)

### 3. Code Organization
- Each page has its corresponding test file
- Test data is externalized in [testData.ts](test-data/testData.ts)
- Configuration is centralized in [playwright.config.ts](playwright.config.ts)

### 4. DRY Principle Implementation
- Common actions are implemented in [BasePage](pages/Basepage.ts)
- Reusable test data is stored in [testData.ts](test-data/testData.ts)
- Utility methods are centralized rather than duplicated

## Running Tests

```bash
# Run all tests
npm test

# Run tests in headed mode
npx playwright test --headed

# Run specific test file
npx playwright test tests/Login.test.ts
```

## Reporting
- JUnit XML reports are generated in [report/results.xml](report/results.xml)
- HTML reports can be generated using `npm run html-report`