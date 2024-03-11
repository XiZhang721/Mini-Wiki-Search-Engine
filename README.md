# TTDS-CW3
Group Project for TTDS Group 7  
Google Doc link: https://docs.google.com/document/d/1Za0dWWm75r-l6Lpnzr0kGfc3kHzmw_p_lUYrEYanY4g/edit?usp=sharing



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
