import re

documents = open("Ottawa_Reddit_Posts.txt", "r")
lines = documents.read()
experiment_doc = open("experiment.txt", "w")
experiment_doc.write(re.sub("cat", "pet", lines))


documents.close()
experiment_doc.close()