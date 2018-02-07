Source for http://onetricks.net

A web application displaying a list of high ELO one trick ponies in League of Legends, using [kayn](https://github.com/cnguy/kayn).

**Status: WIP**

The `master` branch is not necessarily indicative of its current state in release.

In the future, there will be a CHANGELOG for production releases.

# Preview:

![Alt text](/_pictures/small_preview.png?raw=true "onetricks.net")

Note that this codebase is also very old, and my main goal now that I finished building up some stats is to clean up the code.

# Development

```make run # docker-compose up --build```

Currently, the stats/api scripts have to be ran individually (yarn start for stats building, make run for api building).

# Deployment

## DigitalOcean

```sh
make deploy-digital-ocean
```

In DigitalOcean console:

```sh
make run-prod
```

# Overview

This web application is now comprised of five components:
1) Stats microservice (WIP)
2) Site API microservice (kinda done)
3) React Client in ES6 and ReasonML
4) MongoDB for storing One Tricks
5) Redis for caching locally

The scripts build up two important datasets:

1) Statistics
2) One Tricks

# Problems

There are two problems with this web application right now:

Firstly, the stats-building service isn't autonomous, but I hope to change that soon. This should be isolated from onetricks.net which can essentially just be a static website.

Secondly, the One Tricks algorithm isn't an algorithm. It simply just determines the highest played champion of a player, and then just checks if the number of games on that champion is >= {some percentage} of the player's total games.

So basically grade school division.

However, I found that this heuristic only really worked well when there are **accurate** stats (only then did 45% worked really well). This can also be outdated because a player may have switched to one trick a different champion recently.

I used my eyes to judge the results and overall, it seemed fine (I used to be a Challenger player for multiple seasons).

# Reddit Description

[reddit op](https://www.reddit.com/r/leagueoflegends/comments/5x1c5c/hi_i_made_a_small_website_to_compile_a_list_of/)
