# NEWS

| Access Pattern                       | Table/GSI/LSI          | Key Conditions                       | Example |
| ------------------------------------ | ---------------------- | ------------------------------------ | ------- |
| Get news by category sorted by time  | Table                  | pk=NEWS#{category}, sk=gte(time)     | TBD     |
| Get news by category sorted by likes | LSI (sk=likes)         | pk=NEWS#{category}, sk=gt(0)         | TBD     |
| Get news by news_url_hash            | LSI (sk=news_url_hash) | pk=NEWS#{category}, sk=news_url_hash | TBD     |

Table Schema:

```
pk: NEWS#{category}
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

| Access Pattern     | Table/GSI/LSI | Key Conditions                     | Example |
| ------------------ | ------------- | ---------------------------------- | ------- |
| Get all sources    | Table         | pk=SOURCE#{\*}, sk=SOURCE#{\*}     | TBD     |
| Get source by name |               | pk=SOURCE#{name}, sk=SOURCE#{name} | TBD     |

Table Schema:

```
pk: SOURCE#{name}
sk: SOURCE#{name}
attributes:
    - categories
```
