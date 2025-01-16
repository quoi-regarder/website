export class QueryParamsManager {
  private url: URL

  constructor(path: string, baseUrl?: string) {
    if (!baseUrl && typeof window === 'undefined') {
      throw new Error('Base URL is required when running in a server environment.')
    }

    try {
      // Construct the URL with baseUrl if provided, or use the global `window.location.origin` for the client.
      this.url = new URL(path, baseUrl || window.location.origin)
    } catch (error) {
      throw new Error(
        `Invalid URL: ${path}. Ensure the URL is absolute or properly resolved in your application.`
      )
    }
  }

  /**
   * Adds a value to a query parameter or creates the parameter if it doesn't exist.
   * @param key The name of the query parameter.
   * @param value The value to add.
   */
  add(key: string, value: string | number): this {
    const currentValues = this.url.searchParams.getAll(key)
    if (!currentValues.includes(String(value))) {
      currentValues.push(String(value))
      this.url.searchParams.delete(key) // Remove old parameter
      currentValues.forEach((val) => this.url.searchParams.append(key, val))
    }
    return this
  }

  /**
   * Adds multiple values to a query parameter with a specified logical operator.
   * @param key The name of the query parameter.
   * @param values The list of values to add.
   * @param operator The logical operator (`AND` or `OR`).
   */
  addWithLogic(
    key: string,
    values: (string | number | boolean)[],
    operator: LogicalOperator
  ): this {
    if (!Array.isArray(values) || values.length === 0) {
      throw new Error('Values must be a non-empty array.')
    }

    switch (operator) {
      case LogicalOperator.AND:
        this.url.searchParams.set(key, Array.from(new Set(values.map(String))).join(','))
        break

      case LogicalOperator.OR:
        this.url.searchParams.set(key, Array.from(new Set(values.map(String))).join('|'))
        break

      // Add more cases here for additional operators if needed
      default:
        throw new Error(`Unsupported logical operator: ${operator}`)
    }

    return this
  }

  /**
   * Replaces all values of a query parameter with a new value.
   * @param key The name of the query parameter.
   * @param value The new value or array of values.
   */
  replace(key: string, value: string | number | (string | number)[]): this {
    this.url.searchParams.delete(key)
    const values = Array.isArray(value) ? value : [value]
    values.forEach((val) => this.url.searchParams.append(key, String(val)))
    return this
  }

  /**
   * Removes a specific value from a query parameter or deletes the parameter entirely if no value is provided.
   * @param key The name of the query parameter.
   * @param value (Optional) The value to remove.
   */
  remove(key: string, value?: string | number): this {
    if (value === undefined) {
      this.url.searchParams.delete(key)
    } else {
      const remainingValues = this.url.searchParams
        .getAll(key)
        .filter((val) => val !== String(value))
      this.url.searchParams.delete(key)
      remainingValues.forEach((val) => this.url.searchParams.append(key, val))
    }
    return this
  }

  /**
   * Retrieves all values of a query parameter.
   * @param key The name of the query parameter.
   * @returns An array of values or an empty array if the parameter doesn't exist.
   */
  getAll(key: string): string[] {
    return this.url.searchParams.getAll(key)
  }

  /**
   * Retrieves the first value of a query parameter.
   * @param key The name of the query parameter.
   * @returns The first value or null if the parameter doesn't exist.
   */
  getFirst(key: string): string | null {
    return this.url.searchParams.get(key)
  }

  /**
   * Checks if a query parameter contains a specific value.
   * @param key The name of the query parameter.
   * @param value The value to check.
   * @returns True if the value exists, otherwise false.
   */
  contains(key: string, value: string | number): boolean {
    return this.url.searchParams.getAll(key).includes(String(value))
  }

  /**
   * Generates the full URL with the current query parameters.
   * @returns The full URL as a string.
   */
  toString(): string {
    return this.url.toString()
  }
}
