# TTDS-CW3
Group Project for 2023-24 TTDS Group 7  

for text_classification:
pip install transformers datasets

for query_completion:
pip install tensorflow
or
pip install tensorflow-cpu
or
pip install tensorflow-gpu (if have gpu)


for query_suggestion

pip install scikit-learn
queries.txt is all the query logs every time we want to suggest the query we can get the idx and find the query.

two .pickle file is the vectorizing model. used for transfer the sentence to the vector. and calculate the cosine similarity to find the similar query
