1. Create rules only for each source
2. require a parser for each source
3. Have a single function get all categories from a particular source
4. The function first gets the list of categories and associated URLs from DynamoDB
5. Admin will only see list of sources in panel (for which they have rules, consequently a parser is available)
6. Admin can add a category and URL to a source in the panel
