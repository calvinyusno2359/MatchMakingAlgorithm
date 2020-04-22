# Project; Match-Made-On-Rainbow
A match making engine that routes a User's chat and audio request to the appropriate Agent. Built using Rainbow API and NodeJS.

**Note: branch v2.1 is the current heroku deployment.**

## How to Test
### As User:
You may test it yourself by going to this website: https://match-made-on-rainbow.herokuapp.com/.
You MUST log in as the 3 Rainbow Agent sandbox accounts as well! Otherwise, there won't be anyone (likely) to which your User will be routed to.

The following are the 3 Rainbow Agent account details:

|Username          | Password  | Skill tags      |
|------------------|-----------|-----------------|
|testa@gmail.com   | 1234Qwer! | Abdomen         |
|testb@gmail.com   | 1234Qwer! | Back            |
|testgp@gmail.com  | 1234Qwer! | General Enquiry |

### As Agent:
Simply login as Rainbow Agents using the details stated in the table above.
Visit this website to login as Rainbow Agents: https://web-sandbox.openrainbow.com/app/1.69.3/index.html#/login.

### As Admin:
git clone `master` branch, in the cloned folder, simply call `npm run test`.
This will simulatenously run the junit white box test, blackbox test and system tests.
The report will be printed out in the console, once each tests are completed.

## Overview
The application follows a seven-step process to connect a User to an appropriate Agent
1. The User arrives in the web page, specifies his `tag` and requests to be connected to an Agent.
2. The match-made-on-rainbow server receives this request and in turn requests rainbow server for an `Anonymous Guest Account` on behalf of User.
3. Rainbow server creates an `Anonymous Guest Account` for the User and returns a `login_token`.
4. match-made-on-rainbow server queries the database for currently available User (if necessary) before performs the algorithm on the `tag` and the list of  of Agents to find a match.
5. When match-made-on-rainbow server has found a matching `agent_id`, it sends both the `agent_id` and the `login_token` back to the User's browser.
6. User receives the `login_token` and the `agent_id` which indicate which Agent the User should contact.
7. User's browser logins as an `Anonymous Guest` using `login_token` and creates a `Conversation` with the designated Agent using Rainbow API

The following image summarizes the seven-step process:

<p align="center"><img src="/images/overview.jpg" alt="Overview Image"></p>

## The Routing Algorithm
The Routing Algorithm has the following characteristics:
1. The algorithm attempts to match a user specifying a certain `tag` with an **online** Agent who has that `tag` in his/her `skill_tags`. If there is not a single **online** Agent that has the specified `tag`, the User will be notified.
2. When a match is found, the user will be put in a `Queue`. The Agent will only handle the **first** User in the queue. i.e. index 0 of the `Queue`.
3. When matching, the algorithm will attempt to put the User in the **shortest** `Queue` possible. Please see the following diagram for clarity **(Note: i denotes the order in which the Users requested to be matched!)**:

<p align="center"><img src="/images/mme_algorithm.jpg" alt="MME Algorithm Image"></p>

4. When a User disconnects, the User is dequeued from the `Queue`. If **after dequeueing** the Agent's `Queue` is **empty**, the Agent will **steal** the second User (index 1)  from the **longest** `Queue`. This is an attempt to distribute the load of an Agent.

<p align="center"><img src="/images/mme_algorithm_steal.jpg" alt="Queue Stealing Image"></p>

5. When a User is **NOT** being served (i.e. index > 0), instead of returning the `agent_id`, the algorithm will return `WAIT` signal instead. Users will only receive `agent_id` when they're on the top of the `Queue` (index 0)!
