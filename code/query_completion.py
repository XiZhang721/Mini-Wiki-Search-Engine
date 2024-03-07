from keras.preprocessing.sequence import pad_sequences
from keras.models import load_model
from pickle import load
import numpy as np
import os

#This model just predict one word only

model_path = os.path.join('checkpoints', 'bigram_model.h5')
model = load_model(model_path)
tokenizer = load(open('checkpoints/tokenizer', 'rb'))

seq_length = 1

def generate_text_seq(model, tokenizer, text_seq_length, seed_text, n_words, n_predictions):
    for _ in range(n_words):
        encoded = tokenizer.texts_to_sequences([seed_text])[0]
        encoded = pad_sequences([encoded], maxlen=text_seq_length, truncating='pre')

        # 使用model.predict而不是predict_classes
        y_predict = model.predict(encoded)

        # 获取前n个最可能的单词的索引
        predicted_indices = np.argsort(y_predict[0])[-n_predictions:]

        # 索引排序是从小到大，所以这里我们需要反转数组
        predicted_indices = predicted_indices[::-1]

        predicted_words = []
        for index in predicted_indices:
            for word, word_index in tokenizer.word_index.items():
                if word_index == index:
                    predicted_words.append(word)
                    break

        # 你可以选择将这些单词以不同的方式加入到seed_text中
        # 例如，你可以只添加概率最高的单词，或者根据具体的应用场景来决定
        seed_text += " " + predicted_words[0]  # 这里只是一个示例，根据你的需求可能会有所不同

    return predicted_words  # 根据需要返回值 可以只取最大概率的值 比如['potter', 'met', 'have']中只取potter

# bigram model only use the previous word to predict next word
print(generate_text_seq(model, tokenizer, seq_length, 'harry', 1, 3))
print(generate_text_seq(model, tokenizer, seq_length, 'what', 1, 3))
print(generate_text_seq(model, tokenizer, seq_length, 'how', 1, 3))
print(generate_text_seq(model, tokenizer, seq_length, 'love', 1, 3))



