// REQUIRED: data must contain nested object in that order: Countries, People, and Animals.
const countries = require('./data.json')

/**
 * Filters countries, people, and animals based on matching filter value in animal names
 * - Preserve data structure and order
 * - Removes empty arrays
 * @param {Array} countries - Array of countries with nested people and animals
 * @param {string} filter - Pattern to search for in animal names
 * @returns {Array} Filtered countries containing only people with animals matching the pattern
 */
function filter(countries, filter) {
  // Reduce for mapping and filtering both at once
  return countries.reduce((filteredCountries, country) => {
    const filteredPeople = country.people.reduce((filteredPeople, person) => {
      const filteredAnimals = person.animals.filter((animal) => animal.name.includes(filter))
      if (filteredAnimals.length) filteredPeople.push({ ...person, animals: filteredAnimals })
      return filteredPeople
    }, [])
    if (filteredPeople.length) filteredCountries.push({ ...country, people: filteredPeople })
    return filteredCountries
  }, [])
}

/**
 * Adds number of children count annotation to country and people names
 * @param {Array} countries - Array of countries with nested people and animals
 * @returns {Array} Countries and nested people with children count annotation in names
 */
function count(countries) {
  return countries.map(({ name, people }) => ({
    name: `${name} [${people.length}]`,
    people: people.map(({ name, animals }) => ({
      name: `${name} [${animals.length}]`,
      animals,
    })),
  }))
}

// Commands registry for testing purposes
const commands = {
  filter,
  count,
}

/**
 * Parses command line arguments into possible options
 * Handles both --option and --option=value argument patterns
 * @param {Array} args - Raw node.js command line arguments from process
 * @returns {Object} Options object with option name/option value as keys/values
 */
function parseArgs(args) {
  const argPattern = '--'

  // Possible options
  const options = {
    filter: null,
    count: null,
  }

  args.forEach((arg) => {
    Object.keys(options).forEach((option) => {
      if (arg.includes(`${argPattern}${option}`))
        // Recognizes --option and --option=value
        options[option] = arg.split('=')[1] ?? true
    })
  })

  return options
}

/**
 * Script orchestrator that coordinates command execution and result display
 * @param {Array} processArgs - Raw node.js command line arguments from process
 */
function orchestrator(processArgs) {
  const options = parseArgs(processArgs)

  let cmdData
  if (options.filter) cmdData = commands.filter(countries, options.filter)
  else if (options.count) cmdData = commands.count(countries)
  else throw Error('Command unknown')

  console.log(JSON.stringify(cmdData, null, 2))
}

// Export functions for testing purposes
module.exports = {
  commands,
  parseArgs,
  orchestrator,
}

// Only execute entry point when script is run directly through terminal
if (require.main === module) {
  orchestrator(process.argv)
}
