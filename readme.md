## check-ecr

Lil' script to check if your current gitsha corresponds to an image in ECR. Assumes images are built by [ecs-conex](https://github.com/mapbox/ecs-conex).

### Install

```
$ git clone git@github.com:emilymcafee/check-ecr.git
$ cd check-ecr
$ npm link
```

### Usage

From working repo:

```
$ check-ecr
✘ Images not found for commit abcdefg in all specified regions
```

Or:

```
$ check-ecr
✔ Images for abcdefg exist in all specified regions
```

You may want to adjust the regions that the script checks. By default it checks us-west-2, us-east-1, and eu-west-1 (the first regions supported by ECR).
