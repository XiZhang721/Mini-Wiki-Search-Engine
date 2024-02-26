import csv
class Wiki():
    def __init__(self, id, title, content):
        self.id:int = id
        self.title:str = title
        self.content:str = content
wikis = {}
def load_wiki(filename:str):
    with open(filename, mode='r') as file:
        # Create a CSV reader
        csv_reader = csv.reader(file)
        # Iterate over each row in the CSV
        for row in csv_reader:
            row_str = ','.join(row)
            parts = row_str.split(',', 2)
            id, title, content = id, title, content = parts
            id = int(id)
            wiki = Wiki(id, title, content)
            wikis[id] = wiki
        print(len(wikis))
    return wikis

def get_wiki(id:int):
    wiki = wikis[id]
    return (wiki.title, wiki.content)

if __name__ == "__main__":
    # change the path to the entire dataset
    wikis = load_wiki("data/wiki_300.csv")
    title, content = get_wiki(7986334)
    print(title)
    print(content)