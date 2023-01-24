import numpy as np
from sklearn.neighbors import BallTree
import difflib
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

glove_model = {}
tree

def get_nth_key(dictionary, n=0):
    if n < 0:
        n += len(dictionary)
    for i, key in enumerate(dictionary.keys()):
        if i == n:
            return key
    raise IndexError("dictionary index out of range") 

def process_query(File, word_query, numwords):
    global glove_model
    global tree

    print("Loading Glove Model")
    
    # glove model and tree loading
    if not glove_model:
        with open(File,'r') as f:
            for line in f:
                split_line = line.split()
                word = split_line[0]
                embedding = np.array(split_line[1:], dtype=np.float64)
                glove_model[word] = embedding
        print(f"{len(glove_model)} words loaded!")
        tree = BallTree(list(glove_model.values()))
        print("Loading Tree")

    # process the query using the tree
    dist, ind = tree.query([glove_model[word_query]], k = int(numwords))
    print(ind)
    neighbours = []
    for i in ind[0]:
        key = get_nth_key(glove_model, i)
        print(key)
        neighbours.append(key)
    
    print(dist)
    return neighbours

def search_docs(words):
  relevant_lines = []
  file = open("Ottawa_Reddit_Posts.txt", "r")
  for line in file:
    for word in words:
      if word in line:
        relevant_lines.append(line)
        print(line)
        break
  return relevant_lines
      
#search_docs(['sad','awful','sorry','sadly'])
    


