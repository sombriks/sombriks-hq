---
layout: base.webc
tags: 
  - posts
  - sql
  - window functions
date: 2022-07-10
---
# We need to talk about window functions

SQL is the de-facto standard language when we need to deal with data definition,
manipulation and refinement. We
[discussed in the past](/#/blog/0016-vanilla-sql-cookbook.md) a few topics on
that, but one of most important topics were not there, so let fix that.

## What is a window

_TL;DR a window is a way to perform aggregate operations into the tables being
consulted by an analytic query._

### Long example, analytic vs aggregate queries

SQL queries can extract lines (or tuples) from one or several tables from a
database. It also can perform aggregation operations, slightly changing the
meaning of those lines.

For example, if i want to know the highest salary from employee table, i can
either do this:

```sql
select salary as max_salary from employees order by salary desc limit 1;  
```

Or this:

```sql
select max(salary) as max_salary from employees;  
```

For both queries the result would look like this:

```markdown
MAX_SALARY|
----------+
    205.00|
```

The information requested is quite the same, but there is important differences
in the query and in the result:

- SQL queries with [aggregate functions](https://www.sqltutorial.org/sql-aggregate-functions/)
  usually lose some detail information that might or might not be relevant to
  the expected result.
- Some information can only be extracted by aggregate functions.

### Combining analytic with aggregate

In fact, if we need to produce a result which permit us to compare aggregate
results with analytic results, we could end up with some strange join clauses.

Let's say that we want to compare employees salaries with the biggest one. We
could write something like this:

```sql
select name, salary, max_salary 
from employees 
join (select max(salary) as max_salary from employees)
order by salary desc;  
```

The result would be like this:

```markdown
NAME |SALARY|MAX_SALARY|
-----+------+----------+
rick |205.00|    205.00|
jane |200.00|    205.00|
bob  |100.55|    205.00|
eve  |100.00|    205.00|
alice|100.00|    205.00|
```

That way we combine analytic and aggregate information into a single result, but
our query became a little complex. we have a subquery now just to extract info
from the same table being worked on the main query. that's no good.

A window function can perform the same with a less verbose syntax:

```sql
select name, salary, max(salary) over() as max_salary 
from employees 
order by salary desc;  
```

The result is the same as the previous query.

The `over()` statement is the **window** to the aggregate information we need
for our analysis.

## Partitioning and framing a window

The window itself is simpler than a subquery, but it's also a more powerful tool.

For example, let's see our sales and rank them by total cost in each category:

```sql
SELECT 
 ID,
 PRODUCT_CODE, 
 PRODUCT_CATEGORY_CODE, 
 TOTAL_COST,
 RANK() over(PARTITION BY PRODUCT_CATEGORY_CODE 
  ORDER BY TOTAL_COST desc) AS sale_position
FROM sales
ORDER BY PRODUCT_CATEGORY_CODE , TOTAL_COST;
```

The result would be:

```markdown
ID|PRODUCT_CODE|PRODUCT_CATEGORY_CODE|TOTAL_COST|SALE_POSITION|
--+------------+---------------------+----------+-------------+
11|           1|                    1|     10.00|            5|
 6|           1|                    1|     10.00|            5|
 7|           2|                    1|     20.00|            3|
12|           2|                    1|     20.00|            3|
13|           1|                    1|     30.00|            1|
 8|           1|                    1|     30.00|            1|
 9|           3|                    2|     10.00|            2|
14|           3|                    2|     10.00|            2|
10|           3|                    2|     10.00|            2|
15|           3|                    2|     40.00|            1|
17|           4|                    3|     40.00|            2|
16|           4|                    3|     80.00|            1|
```

What does it mean? It show how good each sale is compared with our best sale on
their product category.

Rank operation jumps numbers when there is a tie between results, you can avoid
that by simply using `DENSE_RANK()` instead of `RANK()`.

Another good example: get the
[cumulative distribution](https://www.sqltutorial.org/sql-window-functions/sql-cume_dist/)
of sales by total cost and by product quantity in the sale. useful to understand
what sells more and what worths more.

```sql
SELECT 
 ID,
 PRODUCT_CODE, 
 PRODUCT_CATEGORY_CODE, 
 TOTAL_COST,
 CUME_DIST () over(order BY PRODUCT_QUANTITY) AS sold_items,
 CUME_DIST () over(order BY TOTAL_COST) AS value_items
FROM sales
ORDER BY PRODUCT_CATEGORY_CODE , TOTAL_COST;
```

The result would be:

```markdown
ID|PRODUCT_CODE|PRODUCT_CATEGORY_CODE|TOTAL_COST|SOLD_ITEMS        |VALUE_ITEMS       |
--+------------+---------------------+----------+------------------+------------------+
 6|           1|                    1|     10.00|0.5833333333333334|0.4166666666666667|
11|           1|                    1|     10.00|0.5833333333333334|0.4166666666666667|
12|           2|                    1|     20.00|0.5833333333333334|0.5833333333333334|
 7|           2|                    1|     20.00|0.5833333333333334|0.5833333333333334|
 8|           1|                    1|     30.00|              0.75|              0.75|
13|           1|                    1|     30.00|              0.75|              0.75|
 9|           3|                    2|     10.00|0.5833333333333334|0.4166666666666667|
10|           3|                    2|     10.00|0.5833333333333334|0.4166666666666667|
14|           3|                    2|     10.00|0.5833333333333334|0.4166666666666667|
15|           3|                    2|     40.00|0.9166666666666666|0.9166666666666666|
17|           4|                    3|     40.00|0.9166666666666666|0.9166666666666666|
16|           4|                    3|     80.00|               1.0|               1.0|
```

Queries start to become more and more funky, but the insight extracted from them
become more and more precious to make strategic decisions.

The sample data for this article can be found [here](/assets/post-pics/0035-we-need-to-talk-about-window-functions/sample.sql);

---
Tags:
{%- for tag in tags -%}
[{{tag}}](/blog/?tag={{tag | slugify}})
{%- endfor -%}
