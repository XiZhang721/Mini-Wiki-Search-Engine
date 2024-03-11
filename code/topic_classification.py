import csv

from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch

model_name = "fabriceyhc/bert-base-uncased-dbpedia_14"

# 加载分词器
tokenizer = AutoTokenizer.from_pretrained(model_name)

# 加载模型
model = AutoModelForSequenceClassification.from_pretrained(model_name)

label_dict = {
    0: "Company",
    1: "EducationalInstitution",
    2: "Artist",
    3: "Athlete",
    4: "OfficeHolder",
    5: "MeanOfTransportation",
    6: "Building",
    7: "NaturalPlace",
    8: "Village",
    9: "Animal",
    10: "Plant",
    11: "Album",
    12: "Film",
    13: "WrittenWork",
}

results = []

with open("data/wiki_300.csv", mode='r') as file:
    # Create a CSV reader
    csv_reader = csv.reader(file)
    # Iterate over each row in the CSV
    for row in csv_reader:
        row_str = ','.join(row)
        parts = row_str.split(',', 2)
        id, title, content = parts

        # 待预测的文本
        text = title+" "+content

        # 使用分词器处理文本
        inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)

        # 使用模型进行预测
        with torch.no_grad():  # 不计算梯度，减少计算和内存消耗
            outputs = model(**inputs)

        # 获取预测结果
        predictions = outputs.logits.argmax(-1).item()

        classes = label_dict[predictions]

        # 输出预测类别（需要根据实际情况转换为类别名称）
        # 将id和预测的类别名称添加到结果列表中
        results.append([id, classes])
with open("prediction_results.csv", mode='w', newline='', encoding='utf-8') as output_file:
    writer = csv.writer(output_file)
    # 写入表头（如果需要）
    writer.writerow(["ID", "Predicted Class"])
    # 写入预测结果
    writer.writerows(results)