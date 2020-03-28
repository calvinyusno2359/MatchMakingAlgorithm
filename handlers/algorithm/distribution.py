import sys
import json
import requests
import numpy as np

# use this algorithm when agents > users
class MatchMaker:
    def __init__(self, user_tag):
        self.get_agents(user_tag)

    def get_agents(self, user_tag):
        # query the db api to get the relevant agents
        # harcoded for now
        # agents = {'agent1':{'tags': ['general enquiry'], 'count': 3}, 
        # 'agent3':{'tags': ['general enquiry']}, 'count': 0, 
        # 'agent7':{'tags': ['general enquiry']}, 'count': 4}

        # depends on how the data is received {'agent id': count}
        agents = {'agent1': 3, 'agent3': 0, 'agent7': 4, 'agent9': 30, 'agent4': 1}

        self.agents = agents

    def get_ranking(self):
        return sorted(self.agents.keys(), key=self.agents.__getitem__)

    def increase_count(self, agentid):
        self.agents[agentid] += 1

# Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def main():
    # get our data as an array from read_in()
    lines = read_in()

def test():
    user_tag = ['general enquiry']
    matchmaker = MatchMaker(user_tag)
    print('Before matching: [%s]' % ', '.join(map(str, matchmaker.agents)))
    print('After 1st round of matching: [%s]' % ', '.join(map(str, matchmaker.get_ranking())))
    print('Chosen candidate after 1st round: ' + matchmaker.get_ranking()[0])
    matchmaker.increase_count('agent3')
    matchmaker.increase_count('agent3')
    print('After 2nd round of matching: [%s]' % ', '.join(map(str, matchmaker.get_ranking())))
    print('Chosen candidate after 2nd round: ' + matchmaker.get_ranking()[0])

# Start process
if __name__ == '__main__':
    # main()
    test()