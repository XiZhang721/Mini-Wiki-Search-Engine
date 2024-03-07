from datasets import load_dataset
from torch.utils.data import DataLoader
from transformers import BertTokenizer

dataset = load_dataset("wiki_qa")

print(dataset['train'][0])

query_list = {}
