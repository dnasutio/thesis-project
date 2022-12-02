import numpy as np
from sklearn.neighbors import BallTree
rng = np.random.RandomState(0)
print(rng)
X = rng.random_sample((10, 3))  # 10 points in 3 dimensions
print(X)
tree = BallTree(X, leaf_size=2)
print(tree)              
print(X[:1])
dist, ind = tree.query(X[:1], k=3)                
print(ind)  # indices of 3 closest neighbors

print(dist)  # distances to 3 closest neighbors

d = {1:-0.3246, 2:-0.9185, 3:-3985}
print(list(d.values()))

def get_nth_key(dictionary, n=0):
    if n < 0:
        n += len(dictionary)
    for i, key in enumerate(dictionary.keys()):
        if i == n:
            return key
    raise IndexError("dictionary index out of range") 

def load_glove_model(File):
    print("Loading Glove Model")
    glove_model = {}
    with open(File,'r') as f:
        for line in f:
            split_line = line.split()
            word = split_line[0]
            embedding = np.array(split_line[1:], dtype=np.float64)
            glove_model[word] = embedding
    print(f"{len(glove_model)} words loaded!")
    tree = BallTree(list(glove_model.values()))
    dist, ind = tree.query([glove_model['dog']], k=10)
    print(ind)
    for i in ind[0]:
        key = get_nth_key(glove_model, i)
        print(key)
    
    print(dist)
    return glove_model

load_glove_model("glove.6B.300d.txt")

def process_query(query):
    print(f'Query {query}')
