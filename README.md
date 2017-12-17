Source for http://onetricks.net

A web application displaying a list of high ELO one trick ponies in League of Legends, using [kayn](https://github.com/cnguy/kayn).

# Preview:

![Alt text](/_pictures/small_preview.png?raw=true "onetricks.net")

It used to be much larger than this (around 5-6 rows of champion icons), but it'll take some time until I can build up enough stats for there to be a lot more champions.

Note that this codebase is also very old, and my main goal now that I finished building up some stats is to clean up the code.

# Overview

This web application comprises of five components:
1) Standard Node.js server
2) Static React application
3) Scripts to generate statistics and data
4) MongoDB for storing One Tricks
5) Redis for caching

The scripts build up two important datasets:

1) Statistics
2) One Tricks

# Problems

There are two problems with this web application right now:

Firstly, the stats-building service isn't autonomous, but I hope to change that soon. This should be isolated from onetricks.net which can essentially just be a static website.

Secondly, the One Tricks algorithm isn't an algorithm. It simply just determines the highest played champion of a player, and then just checks if the number of games on that champion is >= {some percentage} of the player's total games.

So basically grade school division.

However, I found that this heuristic worked really well when there are **accurate** stats (0.45 seemed to be a very good number), and can be outdated because a player may have switched to one trick a different champion.

I used my eyes to judge the results and overall, it seemed fine (I used to be a Challenger player for multiple seasons).

# Reddit Description

[reddit op](https://www.reddit.com/r/leagueoflegends/comments/5x1c5c/hi_i_made_a_small_website_to_compile_a_list_of/)
