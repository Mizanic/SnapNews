# NEWS

| Access Pattern                       | Table/GSI/LSI          | Key Conditions                                            | Example |
| ------------------------------------ | ---------------------- | --------------------------------------------------------- | ------- |
| Get news by category sorted by time  | Table                  | pk=NEWS#{country}#{language}#{category}, sk=gte(time)     | TBD     |
| Get news by category sorted by likes | LSI (sk=likes)         | pk=NEWS#{country}#{language}#{category}, sk=gt(0)         | TBD     |
| Get news by news_url_hash            | LSI (sk=news_url_hash) | pk=NEWS#{country}#{language}#{category}, sk=news_url_hash | TBD     |

Table Schema:

```
pk: NEWS#{country}#{language}#{category}
sk: time
attributes:
    - category
    - title
    - news_url
    - summary
    - media
    - news_url_hash
    - likes
    - time
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
