Move-Tasks v1
=====
Action to move issues / PRs between project columns with some conditions

**Features:**
- 🚀 Super-fast with Github graphql and restful APIs
- ✨ Flexible usecases with our [Instructor Query](#instructor-query)
- 🏭 A part of [TekuAsia](https://github.com/tekuasia) standard process (guideline coming soon)

**Table of contents:**
  + [Usage](#usage)
    - [Example usage](#example-usage)
    - [Params](#params)
  + [Instructor Query](#instructor-query)
    - [Query format](#query-format)
    - [Query definitions](#query-definitions)
  + [Contribution](#contribution)

Usage
-----
See [action.yml](action.yml)

### Example usage

Here is an example setup using this action, which required params. Details on params are shown on [Params](#Params) section:

```yaml
...
steps:
  - uses: actions/move-tasks@v1
    with:
      actionToken: <action-token>
      project: <project>
      repository: <repository>
      fromCards: >
        $project
          > columns(name oneOf To, In progress)
          > cards
      toColumn: $project > columns(name is Done)
```

### Params
#### Param `actionToken`
> type: string

This is Github token with permission on Issues & Projects, which can be acquired from [Personal access tokens](https://github.com/settings/tokens)

#### Param `repository`
> type: string

Repository identifier, requires user / organization along (with examples)
  - user name/repo name (`hungluu/move-tasks`)
  - org name/repo name (`tekuasia/blocks`)

#### Param `project`
> type: number | string

This can be project's id (number), name (string) for user / organization projects or even projects that belong to specific repository (with examples):
  - project id (`1`)
  - project name (`Blocks` or a partial like `Blo`)
  - repo's project id (`hungluu/move-tasks/1`)
  - repo's project name (`hungluu/move-tasks/Blocks`)

#### Param `fromCards`
> type: string

This use [instructor query](#instructor-query) query to retrive cards ([definition](#card-definition)) for moving into column

**Example 1** Move all cards from both columns named `In progress` and `To do`:
```yaml
fromCards: >
  $project
    > columns(name oneOf To, In progress)
    > cards
```

**Example 2** Move only cards belonging to closed issues:
```yaml
fromCards: >
  $project
    > columns
    > cards(contentState is closed)
```

**Example 3** Move only cards belonging to pull requests:
```yaml
fromCards: >
  $project
    > columns
    > cards(contentType is Pull Request)
```

**Example 4** Move only cards with specific users (for example `hungluu` and `tranquocthoai`):
```yaml
fromCards: >
  $project
    > columns
    > cards(author oneOf hungluu, tranquocthoai)
```

#### Param `toColumn`
> type: string

This use [instructor query](#instructor-query) query to retrive a column ([definition](#column-definition))

**Example 1** Column named `Done`:
```yaml
toColumn: >
  $project
    > columns(name is Done)
```

**Example 2** Column with id `1235553`:
```yaml
toColumn: >
  $project
    > columns(name is 1235553)
```

Instructor Query
-----
<small>A part of [TekuAsia's building blocks](https://github.com/tekuasia/blocks)</small>

Enable flexible approaches to retrieve resources based on [query definitions](#query-definitions) from data sources (customizable to each project) ([More information](https://github.com/tekuasia/blocks/tree/main/packages/instructor))

### Query format

```
$dataSource.layer(field filter values)
```
Format break-down:
  + **$dataSource** For this particular action, available data sources are:
    - `$project` Everything about project info, columns and cards
    - `$context` To access action github [context](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#github-context) (For example `$context`)
  + **layer** A part / path from data source. for example this is the action's current layer structure:
    ```
    $project {
      columns [
        ...
        {
          cards: [...]
        }
      ]
    }
    ```
  + **field** Depends on layer's data, there are fields we can filter through conditions, for example columns' fields [definition](#column-definition):
    - `id` Column id
    - `name` Column name

  + **filter** Filters indicate what types of condition should be applied to field. For this project they are:
    - `oneOf <values>` Field is one of the provided values (For example `columns(name oneOf Done, Released)`)
    - `is <value>` Check field value (For example `cards(contentAuthor is hungluu)`)
    - `in <list>` Check field value exists on another list (For example `cards(contentAuthor in $context.repo.owner)`)
    - `has` Check if field is a list which contains particular value (For example `cards(labels has release, wip)`)
    - `hasText` check if field is a string which contains a word / text (For example `cards(name hasText abc)`) (This filter is case insensitive)
    - `matches` check if field is a string which matches regex (For example `cards(name matches /abc/i)`)
### Query definitions

#### Card definition:
```js
export interface IProjectCard {
  id: string
  contentId: string
  contentTitle: string
  contentType: string
  contentCreatedAt: string
  contentAuthor: string
  contentState: string
  // { assigneeId: assigneeName }
  contentAssignees: {[key: string]: string}
  // { labelId: labelName }
  contentLabels: {[key: string]: string}
}
```

#### Column definition:
```js
export interface IProjectColumn {
  id: string
  name: string
  cards: IProjectCard[]
}
```

Contribution
-----
Contributions are welcomed. Feel free to clone this project, make changes that your feel necessary and pull request anytime you want.

If you have any other suggestions, you can even open new issues with `enhancement` label.

:beer:
