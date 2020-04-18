# Project; Match-Made-On-Rainbow
A match making engine that routes a User's chat and audio request to the appropriate Agent. Built using Rainbow API and NodeJS.

## How to Test
- As User:
You may test it yourself by going to this website: https://match-made-on-rainbow.herokuapp.com/

- As Agent:
You MUST log in as the following 3 Rainbow Agent accounts from this website as well: https://web-sandbox.openrainbow.com/app/1.69.3/index.html#/login
Otherwise, there won't be anyone (likely) to which your User will be routed to.
The following are the 3 Rainbow Agent account details:
Username          | Password  | Skill tags      |
testa@gmail.com   | 1234Qwer! | Abdomen         |
testb@gmail.com   | 1234Qwer! | Back            |
testgp@gmail.com  | 1234Qwer! | General Enquiry |

- As Admin
git clone `master` branch, in the cloned folder, simply call `npm run test`.
This will simulatenously run the junit white box test, blackbox test and system tests.
The report will be printed out in the console, once each tests are completed.

## Overview
The application follows a seven-step process to connect a User to an appropriate Agent
1. The User arrives in the web page, specifies his `tags` and requests to be connected to an Agent
2. The server receives this request, logins as Rainbow Bot Account and requests for an `Anonymous Guest Account`
3. Rainbow server creates an `Anonymous Guest Account` for the User and returns a `login token`
5. match-made-on-rainbow server performs an algorithm on the `tags` and list of Agents to find matches and returns a `Agent Priority List` before returning to User
6. User receives a `login token` and an `agent_id` to contact
7. User logins as `Anonymous Guest` and creates a `Conversation` with the designated Agent using Rainbow API

The following image summarizes the seven-step process:

![Overview Image](/images/overview.jpg)

## The Routing Algorithm
The algorithm treats User `tags` and Agent `skills` as vectors and attempt to find their similarity score. Then, it...
- [Cosine Similarity](#Cosine-Similarity)

## Issues of Naive Routing Algorithm
The Naive Routing Algorithm involves pooling all the available Agents into 1 pool and then queueing all Users into 1 queue. Then, using First In First Out (FIFO) Policy, queued Users are matched by their `tags` to a list of Agents, prioritizing Agents with the least `skills`.

The Naive Routing Algorithm has several issues that are remedied by the proposed Routing Algorithm.

<details>
<summary><b>Sub-optimal Match Cases</b></summary>

The Naive Routing Algorithm works well when there are very few `tags` involved and many Agents covering multiple `tag` combinations allowing for perfect matches. However, as the number of `tags` increase and Agents decrease, Naive Routing Algorithm will perform poorly when it has to make sub-optimal matches.

For example, given 26 `tags` from `a` to `z`, suppose that a User chooses 4 out of these `tags`. In total there will be `26C4 = 14950` total combinations. It is unlikely that there will be a perfect match to be found between this User and any Agent available.

As one can expect, this scenario is fairly common and should be expected to be the norm. As such, for a routing algorithm to perform well, it should be able to generate and rank sub-optimal matches fairly well. The proposed algorithm uses cosine similarity to generate and rank sub-optimal match cases.

### Cosine Similarity



</details>
