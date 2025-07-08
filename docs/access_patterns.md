# NEWS

| Access Pattern                            | Table/GSI/LSI          | Key Conditions                             | Example |
| ----------------------------------------- | ---------------------- | ------------------------------------------ | ------- |
| Get news by category sorted by time       | Table                  | pk=NEWS#{country}#{language}, sk=gte(time) | TBD     |
| Get news by category sorted by popularity | LSI (sk=sk_popularity) | pk=NEWS#{country}#{language}, sk=gt(0)     | TBD     | xxx - sk not unique |
| Update news by pk, sk                     | Table                  | pk=pk, sk=sk                               | TBD     |

Table Schema:

```
pk: NEWS#{country}#{language}
sk: UUIDv7
default_attributes:
    - ttl
attributes:
    - source_name
    - source_id
    - country
    - language
    - news_url
    - headline
    - published
    - summary
    - tags
    - media
    - likes
    - bookmarks
    - shares
    - views
computed_keys:
    - sk_top: TOP#[f(views, likes, shares, bookmarks)]#uuidv7
```

# SOURCE

| Access Pattern                                 | Table/GSI/LSI | Key Conditions | Example |
| ---------------------------------------------- | ------------- | -------------- | ------- |
| Get all sources by country and language        | Table         |                | TBD     |
| Update source by country, source, and language | Table         |                | TBD     |

Table Schema:

```
pk: SOURCE#{country}#{language}
sk: NAME#{name.short}
attributes:
    - categories
    - country
    - language
    - name.short
    - name.long
    - feeds
```
