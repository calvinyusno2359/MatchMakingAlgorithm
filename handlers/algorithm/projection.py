import sys
import json
import requests
import numpy as np

class MatchMaker:
    def __init__(self, vector, agent_ids):
        self.user_vector = np.array(vector / np.linalg.norm(vector))
        self.agent_ids = agent_ids

    def get_matrix(self, link=""):
        if link == "": pass
        # get request returns matrix
        matrix = [
                    [2.0, 2.1, 0],
                    [0.1, 1, 1],
                    [0.2, 0.7, 1]
                 ]

        self.matrix = np.array(matrix)
        return self

    def get_magnitude(self):
        magnitude = []
        for vector in self.matrix:
            norm = np.linalg.norm(vector)
            magnitude.append(norm)
        self.magnitude = np.array(magnitude)
        return self

    def matrix_mult(self):
        self.get_matrix()
        self.agent_scores = np.matmul(self.user_vector, self.matrix)
        return self

    def normalize(self):
        self.get_magnitude()
        self.normalized_agent_scores = self.agent_scores / self.magnitude

        return self

    def solve(self):
        self.matrix_mult()
        self.normalize()
        return self

    def get_norm_agent_scores(self):
        return self.normalized_agent_scores

# Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def main():
    # get our data as an array from read_in()
    lines = read_in()

    agent_ids = lines['agent_ids']
    tags = lines['tags']

    # do algo here to get score
    matchmaker = MatchMaker(tags, agent_ids)
    agent_scores = matchmaker.solve().get_norm_agent_scores().tolist()
    # agent_scores = [0.2, 0.3, 0.1]

    # return the sum to the output stream
    print(agent_scores)

def test():
    agent_ids = ['agent1', 'agent2', 'agent3']
    tags = [0, 1, 1]

    matchmaker = MatchMaker(tags, agent_ids)
    agent_scores = matchmaker.solve().get_norm_agent_scores()
    print(agent_scores)

# Start process
if __name__ == '__main__':
    # main()
    test()
