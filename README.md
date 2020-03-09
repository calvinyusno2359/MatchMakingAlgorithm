# Project; Match-Made-On-Rainbow
A match making engine that routes a user's chat and audio request to the appropriate agent. Built using Rainbow API on NodeJS.

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

You may test it yourself by going to this website: http://match-made-on-rainbow.herokuapp.com/

## The Routing Algorithm
The algorithm treats User `tags` and Agent `skills` as a vectors and attempt to find their similarity score.
- [Cosine Similarity](#Cosine Similarity)


## Issues of Naive Routing


<details>
<summary><b>Problem</b></summary>
### Cosine Similarity
hello
</details>
