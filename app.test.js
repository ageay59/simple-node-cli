const { commands, parseArgs, orchestrator } = require('./app')
const mockCountries = require('./mock-data.json')

describe('CLI', () => {
  describe('filterCmd', () => {
    const filter = 'og'
    const results = commands.filter(mockCountries, filter)

    test('[Data] test dataset must provide at least one country passing filtering', () => {
      expect(results.length).toBeGreaterThanOrEqual(1)
    })

    test('[BR] should filter animals matching filter arg', () => {
      results.forEach((country) => {
        country.people.forEach((person) => {
          expect(person.animals).toEqual(
            expect.arrayOf(expect.objectContaining({ name: expect.stringMatching(filter) })),
          )
        })
      })
    })

    test('[BR] should preserve order of animals', () => {
      results.forEach((country) => {
        country.people.forEach((person) => {
          // Animals for this person before filtering
          const testAnimals = mockCountries
            .find((testCountry) => country.name === testCountry.name)
            .people.find((testPerson) => person.name === testPerson.name).animals

          // Filtered animals previous idxs before filtering
          const previousIdxs = person.animals.map((animal) =>
            testAnimals.findIndex((testAnimal) => testAnimal.name === animal.name),
          )

          // Idxs must be ascending to validate order preservation
          const isAscending = previousIdxs.every(
            (value, index, arr) => index === 0 || value > arr[index - 1],
          )
          expect(isAscending).toBe(true)
        })
      })
    })

    test('[BR] should remove parent if all children are filtered', () => {
      results.forEach((country) => {
        expect(country.people.length).toBeGreaterThanOrEqual(1)
        country.people.forEach((person) => {
          expect(person.animals.length).toBeGreaterThanOrEqual(1)
        })
      })
    })
  })

  describe('countCmd', () => {
    const results = commands.count(mockCountries)

    test('[Data] test dataset must provide at least one country to be counted', () => {
      expect(results.length).not.toBe(0)
    })

    test('[BR] should add children count to parent name with correct format', () => {
      results.forEach((country, i) => {
        const prevCountry = mockCountries[i]
        expect(country.name).toBe(`${prevCountry.name} [${country.people.length}]`)
        country.people.forEach((person, j) => {
          const prevPerson = prevCountry.people[j]
          expect(person.name).toBe(`${prevPerson.name} [${person.animals.length}]`)
        })
      })
    })
  })

  describe('parseArgs', () => {
    const filter = 'test'

    test('[BR] should parse filter argument', () => {
      const options = parseArgs(['node', 'app.js', `--filter=${filter}`])

      expect(options.filter).toBe(filter)
    })

    test('[BR] should parse count argument', () => {
      const results = parseArgs(['node', 'app.js', '--count'])

      expect(results.filter).toBeNull()
    })

    test('[BR] should parse all arguments', () => {
      const results = parseArgs(['node', 'app.js', `--filter=${filter}`, '--count'])

      expect(results.filter).toBe(filter)
      expect(results.count).toBe(true)
    })

    test('[BR] should handle no arguments', () => {
      const results = parseArgs(['node', 'app.js'])

      expect(results.filter).toBeNull()
      expect(results.count).toBeNull()
    })
  })

  describe('orchestrator', () => {
    let consoleSpy
    let filterCmdSpy
    let countCmdSpy
    const filter = 'test'

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'log').mockImplementation()
      filterCmdSpy = jest.spyOn(commands, 'filter').mockReturnValue([])
      countCmdSpy = jest.spyOn(commands, 'count').mockReturnValue([])
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    test('[BR] should throw error for unknown command', () => {
      expect(() => {
        orchestrator(['node', 'app.js'])
      }).toThrow()
    })

    test('[BR] should filter if filter arg provided', () => {
      expect(() => {
        orchestrator(['node', 'app.js', `--filter=${filter}`])
      }).not.toThrow()
      expect(filterCmdSpy).toHaveBeenCalled()
      expect(filterCmdSpy).toHaveBeenLastCalledWith(expect.anything(), filter)
    })

    test('[BR] should count if count arg provided', () => {
      expect(() => {
        orchestrator(['node', 'app.js', '--count'])
      }).not.toThrow()

      expect(countCmdSpy).toHaveBeenCalled()
    })

    test("[BR] should log successful commands' results", () => {
      orchestrator(['node', 'app.js', `--filter=${filter}`])
      orchestrator(['node', 'app.js', '--count'])

      expect(consoleSpy).toHaveBeenCalledTimes(2)
    })
  })
})
