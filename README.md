# JavaScript Developer Test - CLI Filter & Count Tool

A Node.js command-line interface for filtering and counting nested data structures containing Countries, People, and Animals.

- No external libraries (except testing framework)
- Comprehensive test coverage
- Clean, readable, and maintainable code structure
- Git repository ready

## Features

- **Filter Mode**: Filter animals by name pattern
- **Count Mode**: Add children count annotations

## Installation

```bash
# Install dependencies
npm install
```

## Usage

### Filter Command

- ✅ Filter animals containing a specific pattern in their names
- ✅ Original order is preserved at all levels (countries, people, animals)
- ✅ Parents are removed if all children are filtered out

```bash
node app.js --filter=ry
```

### Count Command

- ✅ Add count information to names showing number of children:

```bash
node app.js --count
```

## Running Tests

- **`[Data]`** - Data validation tests
- **`[BR]`** - Business Rule tests

```bash
# Run all tests
npx jest
```

## License

This project is created as a technical assessment and is intended for evaluation purposes.
